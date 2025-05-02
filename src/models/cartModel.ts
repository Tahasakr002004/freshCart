import mongoose, { Schema, Document,ObjectId } from "mongoose";
import { IProduct } from "./productModel";



export interface ICartItem{
  product: IProduct ;
  unitPrice: number;
  quantity: number;
}





export interface ICart extends Document {
  userId:  ObjectId | string; // Assuming userId is a string or ObjectId
  items: ICartItem[];
  totalAmount: number;
  status: "active" | "completed";
}


const cartItemSchema: Schema = new Schema<ICartItem>({

  product: { type: Schema.Types.ObjectId, ref: "product", required: true },
  quantity: { type: Number, required: true ,default: 1 },
  unitPrice: { type: Number, required: true },
});

const cartSchema: Schema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref:"user", required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number,required:true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

export const cartModel = mongoose.model<ICart>("carts", cartSchema);
