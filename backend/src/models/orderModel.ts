// orderModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  userId: any | string | mongoose.Types.ObjectId;
  address: string
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId , ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'cancelled'], default: 'pending' },
  address:{type: String, required:true}
} );

const orderModel = mongoose.model<IOrder>('Order', orderSchema);
export default orderModel;
