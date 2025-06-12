// import { CreateOrderForUser } from './orderService';
import orderModel from '../models/orderModel';
import { getActiveCartForUser,  clearCart } from './cartService';
import productModel from '../models/productModel';
import mongoose from 'mongoose';






export interface CreateOrderForUser{
  userId: any | string | mongoose.Types.ObjectId;
  address: string
};



export const checkout = async ({userId,address}:CreateOrderForUser) => {
  const cart = await getActiveCartForUser({ userId });
  if (!cart || cart.items.length === 0) {
    return { data: 'Cart is empty', statusCode: 400 };
  }

  // Check stock and reduce
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);
    if (!product || product.stock < item.quantity) {
      return { data: `Product ${item.product} is out of stock`, statusCode: 400 };
    }
    product.stock -= item.quantity;
    await product.save();
  }

  // Create order
  const order = await orderModel.create({
    userId,
    items: cart.items,
    totalAmount: cart.totalAmount,
    status: 'pending',
    address,
  });
  await order.save();
  
  await clearCart({userId}); // clear user cart after order
  return { data: order, statusCode: 201 };
};






////////////////////////////////////////////////////
//SHOW Order ITEMS
export const showOrders = async (userId: string) => {
  try {
    const orders = await orderModel.find({ userId });
    return { data: orders, statusCode: 200 };
  } catch (error) {
    return { data: { message: "Failed to retrieve orders", error }, statusCode: 500 };
  }
};