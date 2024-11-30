import { Schema, model, Document, models } from 'mongoose';

export interface IBalance extends Document {
    group: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

const balanceSchema = new Schema<IBalance>({
    group: { type: String, required: true },
    balance: { type: Number, required: true },
}, 
{ timestamps: true });

const Balance = models.Balance || model<IBalance>("Balance", balanceSchema);

export default Balance;