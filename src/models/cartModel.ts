import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./productModel";



export interface ICartItem extends Document {
  product: IProduct;
  unitPrice: number;
  quantity: number;
}





export interface ICart extends Document {
  userId:  string; // Assuming userId is a string or ObjectId
  items: ICartItem[];
  totalAmount: number;
  status: "active" | "completed" | "cancelled";
  totalPrice: number;
}


const cartItemSchema: Schema = new Schema<ICartItem>({
  
  product: { type: Schema.Types.ObjectId, ref: "product", required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true ,default: 1 },

});

const cartSchema: Schema = new Schema<ICart>({
  userId: { type: String, ref:"user", required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
  totalPrice: { type: Number, default: 0 },
});

export const cartModel = mongoose.model<ICart>("cart", cartSchema);
export const cartItemModel = mongoose.model<ICartItem>("cartItems", cartItemSchema);