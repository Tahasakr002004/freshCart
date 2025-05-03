import mongoose,{ Schema, Document,ObjectId } from "mongoose";




export interface IOrderItem{
  productTitle: string; 
  productImage: string;
  unitPrice: number;
  quantity: number;
}


export interface IOrder extends Document {
  userId:string; 
  orderItems: IOrderItem[];
  totalAmount: number;
  address: string;
}

const orderItemSchema: Schema = new Schema<IOrderItem>({
  productTitle: { type:String, ref: "product", required: true },
  productImage: { type: String },
  quantity: { type: Number, required: true ,default: 1 },
  unitPrice: { type: Number, required: true },
});

const orderSchema: Schema = new Schema<IOrder>({
  userId: { type: String, ref:"user", required: true },
  orderItems: [orderItemSchema],
  totalAmount: { type: Number,required:true },
  address: { type: String, required: true },
});

const orderModel = mongoose.model<IOrder>("orders", orderSchema);
export default orderModel;