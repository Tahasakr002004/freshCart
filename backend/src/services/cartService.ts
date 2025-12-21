import mongoose from "mongoose";
import { cartModel ,ICart } from "../models/mongodb/cartModel";
import productModel  from "../models/mongodb/productModel";
import  orderModel  from "../models/mongodb/orderModel";
import { IOrderItem } from "../models/mongodb/orderModel";
 interface CreateCartForUserRequest {
  userId: string; // Assuming userId is a string
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const calculateTotalAmount = ({cart,productId}:{cart:ICart,productId:string}) => {

  const otherCartItems = cart.items.filter((item) => item.product.toString() !== productId);
  let total = otherCartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  return total;
} 
/////////////////////////////////////////////////////////////////////////////////



export const createCartForUser = async ({userId}: CreateCartForUserRequest) => {
    const cart = await cartModel.create({ userId });
    await cart.save(); // Save the cart to the database
    return cart;
}

///////////////////////////////////////////////////////////////

interface GetActiveCartRequest {
  userId: string; // Assuming userId is a string
}


export const getActiveCartForUser = async ({userId}:GetActiveCartRequest) => {
    let cart = await cartModel.findOne({ userId,status: "active" });   
    if(!cart) {
      cart = await createCartForUser({userId});
    }
    return cart;
};


interface AddItemToCartRequest {
  productId: any | string | mongoose.Types.ObjectId,
  quantity: number,
  userId:any | string | mongoose.Types.ObjectId

}

///////////////////////////////////////////////////////////////
export const addItemToCart = async ({ userId, productId, quantity }: AddItemToCartRequest) => {
  const cart =  await getActiveCartForUser({ userId });

  const product = await productModel.findById(productId);
  if(!product) {
    return { data: "Product not found",statusCode:400 }
  }

  const existsInCart = cart.items.find((item) => item.product.toString() === productId);

  // If already in cart, just bump quantity instead of failing
  if (existsInCart) {
    const newQuantity = existsInCart.quantity + quantity;

    if (product.stock < newQuantity) {
      return { data: "Not enough stock available", statusCode: 400 };
    }

    existsInCart.quantity = newQuantity;
    existsInCart.unitPrice = product.price;

    const total = calculateTotalAmount({ cart, productId });
    cart.totalAmount = total + product.price * newQuantity;

    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };
  }

  if (product.stock < quantity) {
    return { data: "Not enough stock available", statusCode: 400 };
  }

  cart.items.push({
    product: productId,
    productName: product.name,
    unitPrice: product.price,
    quantity,
  });

  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 201 };
};




///////////////////////////////////////////////////////////////
// UPDATE THE CART
interface UpdateItemInCartRequest {
  productId: any | string | mongoose.Types.ObjectId,
  quantity: number,
  userId:any | string | mongoose.Types.ObjectId
}


// Update item in cart
export const updateItemInCart = async ({ userId, productId, quantity }: UpdateItemInCartRequest) => {

  const cart = await getActiveCartForUser({ userId });
  
  const existsInCart = cart.items.find((item) => item.product.toString() === productId);
  if (!existsInCart) {
    return { data: "Item not found in the cart", statusCode: 400 };
  }
  const product = await productModel.findById(productId);
  if(!product) {
    return { data: "Product not found",statusCode:400 }
  }
  existsInCart.quantity = quantity; // Update the quantity

  // Update the product stock in the database
  if (product.stock < quantity) {
    return { data: "Not enough stock available", statusCode: 400 };
  }

  let total = calculateTotalAmount({cart,productId});

   total += existsInCart.unitPrice * quantity; // Add the updated item price
  cart.totalAmount = total; // Update the total amount

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
interface DeleteItemInCartRequest {
   productId: any | string | mongoose.Types.ObjectId,
   userId:any | string | mongoose.Types.ObjectId
}

export const deleteItemInCart = async ({ userId, productId}:DeleteItemInCartRequest) => {

  const cart = await getActiveCartForUser({ userId });
  
  // Check if the item exists in the cart
  const existsInCart = cart.items.find((item) => item.product.toString() === productId);
  if (!existsInCart) {
    return { data: "Item not found in the cart", statusCode: 400 };
  }
  const total = calculateTotalAmount({cart,productId});
  cart.totalAmount = total;
  const otherCartItems = cart.items.filter((item) => item.product.toString() !== productId);
  cart.items = otherCartItems;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
}


interface ClearCartRequest {
     userId:any | string | mongoose.Types.ObjectId
}


export const clearCart = async ({ userId }: ClearCartRequest) => {

  const cart = await getActiveCartForUser({ userId });
  cart.items = []; // Clear the items array
  cart.totalAmount = 0; // Reset the total amount
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };

}
