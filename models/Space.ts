import { Schema, model, Document, Types, models } from 'mongoose';
import { IProduct } from './Product';

export interface ISpace extends Document {
  _id: Types.ObjectId;
  name: string;
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const spaceSchema = new Schema<ISpace>({
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const Space = models.Space || model<ISpace>("Space", spaceSchema);

export default Space;