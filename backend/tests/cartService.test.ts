import * as cartService from '../src/services/cartService';
import productModel from '../src/models/mongodb/productModel';
import { cartModel } from '../src/models/mongodb/cartModel';

jest.mock('../src/models/mongodb/productModel', () => ({
  __esModule: true,
  default: { findById: jest.fn() },
}));

jest.mock('../src/models/mongodb/cartModel', () => ({
  __esModule: true,
  cartModel: {
    findOne: jest.fn(),
  },
}));

const productModelMock = productModel as unknown as { findById: jest.Mock };
const cartModelMock = cartModel as unknown as { findOne: jest.Mock };

describe('cartService.addItemToCart', () => {
  const userId = 'user-1';
  const productId = 'prod-1';
  const otherProductId = 'prod-2';

  const createCart = () => ({
    items: [
      { product: productId, productName: 'Apple', unitPrice: 5, quantity: 1 },
      { product: otherProductId, productName: 'Banana', unitPrice: 3, quantity: 2 },
    ],
    totalAmount: 11,
    status: 'active',
    save: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('recalculates total with other items when item exists', async () => {
    const cart = createCart();
    cartModelMock.findOne.mockResolvedValue(cart);
    productModelMock.findById.mockResolvedValue({
      _id: productId,
      name: 'Apple',
      price: 5,
      stock: 10,
    });

    const result = await cartService.addItemToCart({
      userId,
      productId,
      quantity: 2,
    });

    expect(result.statusCode).toBe(200);
    const updatedItem = cart.items.find((item) => item.product === productId);
    const otherItem = cart.items.find((item) => item.product === otherProductId);
    expect(updatedItem?.quantity).toBe(3);
    expect(otherItem?.quantity).toBe(2);
    expect(cart.totalAmount).toBe(21);
    expect(cart.save).toHaveBeenCalled();
  });

  it('returns 400 when stock is insufficient for increment', async () => {
    const cart = createCart();
    cartModelMock.findOne.mockResolvedValue(cart);
    productModelMock.findById.mockResolvedValue({
      _id: productId,
      name: 'Apple',
      price: 5,
      stock: 2,
    });

    const result = await cartService.addItemToCart({
      userId,
      productId,
      quantity: 2,
    });

    expect(result.statusCode).toBe(400);
    expect(result.data).toBe('Not enough stock available');
    expect(cart.save).not.toHaveBeenCalled();
  });
});
