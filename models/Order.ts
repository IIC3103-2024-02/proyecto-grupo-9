import { Schema, model, Document, Types, models } from 'mongoose';
import { IProduct } from './Product';

export interface IOrder extends Document {
  _id: string;
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const Order = models.Order || model<IOrder>("Order", orderSchema);

export default Order;