import mongoose, { Schema, Document } from "mongoose";


export interface IProduct extends Document {
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number },
  imageUrl: { type: String },
  stock: { type: Number },
});

const productModel = mongoose.model<IProduct>("products", productSchema);
export default productModel;
