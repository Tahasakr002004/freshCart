import { cartModel } from "../models/cartModel";


 interface CreateCartForUserRequest {
  userId: string; // Assuming userId is a string
}


export const createCartForUser = async ({userId}: CreateCartForUserRequest) => {
  try {
    const cart = await cartModel.create({ userId });
    await cart.save(); // Save the cart to the database
    return cart;
  } catch (error) {
    throw new Error("Error creating cart for user: " + error);
  }
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
