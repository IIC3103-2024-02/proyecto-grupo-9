import { Schema, model, Document, Types, models } from 'mongoose';
import { IProduct } from './Product';

export interface IOrder extends Document {
  _id: string;
  products: { sku: string, quantity: number }[];
  dueDate: Date;
  status: 'pending' | 'rejected' | 'acepted' | 'delivered' | 'passed';
  quantity: number;
  dispatched: number;
  client: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
    _id: { type: String, required: true },
    products: {
        type: [{ sku: String, quantity: Number }],
        required: true
    },
    status: { type: String, enum: ['pending', 'rejected', 'acepted', 'delivered', 'passed'], default: "pending" },
    dueDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    dispatched: { type: Number, required: true },
    client: { type: String, required: true },
    provider: { type: String, required: true }
    

}, { timestamps: true });

const Order = models.Order || model<IOrder>("Order", orderSchema);

export default Order;