import { Schema, model, Document, Types, models } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  sku: string;
  name: string;
  recipe: { 
    sku: string, 
    req: number 
  }[];
  production: {
    at: string,
    batch: number,
    time: number,
    groups: [string]
  };
  expiration: number;
  cost: number;
  price: number;
  sellable: boolean;
  storage: {
    cold: boolean,
  }
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    recipe: { 
        type: [{ sku: String, req: Number }], 
        required: true
    },
    production: {
        at: { type: String, required: true },
        batch: { type: Number, required: true },
        time: { type: Number, required: true },
        groups: { type: [String], required: true }
    },
    expiration: { type: Number, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    sellable: { type: Boolean, required: true, default: false },
    storage: {
        cold: { type: Boolean, required: true, default: false }
    }
}, { timestamps: true });

const Product = models.Product || model<IProduct>("Product", productSchema);

export default Product;