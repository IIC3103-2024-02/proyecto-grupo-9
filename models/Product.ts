import { Schema, model, Document, Types, models } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  SKU: string;
  expirationDate: Date;
  location: string;
  refrigerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    SKU: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    location: { type: String, required: true },
    refrigerated: { type: Boolean, required: true },
}, { timestamps: true });

const Product = models.Product || model<IProduct>("Product", productSchema);

export default Product;