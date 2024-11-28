'use server'

import connectDB from "@/lib/db"
import Invoice from "@/models/Invoice"
import { emitInvoiceAsync } from "@/lib/soap"

export async function createInvoice(orderId: string) {
    try {
        await connectDB();
        const billingDetails = await emitInvoiceAsync(orderId);
        console.log('billingDetails: ', billingDetails);
        await Invoice.create({
            id: billingDetails.id,
            client: billingDetails.client,
            supplier: billingDetails.supplier,
            channel: billingDetails.channel,
            status: billingDetails.status,
            price: billingDetails.price,
            totalPrice: billingDetails.totalPrice,
            interest: billingDetails.interest,
            createdAt: billingDetails.createdAt,
            updatedAt: billingDetails.updatedAt
        });
    } catch (error) {
        console.log('Error en createInvoice: ', error)
    }
}