import { Schema, model, Document, models } from 'mongoose';

export interface IInvoice extends Document {
    id: string;
    client: string;
    supplier: string;
    channel: string;
    status: string;
    price: number;
    interest: number;
    createdAt: Date;
    updatedAt: Date;
} 

const invoiceSchema = new Schema<IInvoice>({
    id: { type: String, required: true },
    client: { type: String, required: true },
    supplier: { type: String, required: true },
    channel: { type: String, required: true },
    status: { type: String, required: true },
    price: { type: Number, required: true },
    interest: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});

const Invoice = models.Invoice || model<IInvoice>("Invoice", invoiceSchema);

export default Invoice;