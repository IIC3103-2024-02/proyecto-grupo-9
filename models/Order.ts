import { Schema, model, Document, Types, models } from 'mongoose';
import { IProduct } from './Product';

export interface IOrder extends Document {
  _id: string;
  products: { sku: string, quantity: number }[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
    _id: { type: String, required: true },
    products: {
        type: [{ sku: String, quantity: Number }],
        required: true
    },
    dueDate: { type: Date, required: true },

}, { timestamps: true });

const Order = models.Order || model<IOrder>("Order", orderSchema);

export default Order;