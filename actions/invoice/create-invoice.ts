'use server'

import connectDB from "@/lib/db"
import Invoice from "@/models/Invoice"
import { emitInvoiceAsync } from "@/lib/soap"

export async function createInvoice(orderId: string) {
    try {
        await connectDB();
        const billingDetails = await emitInvoiceAsync(orderId);
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
        console.log('Factura creada con éxito');
    } catch (error: any) {
        console.error('Error en createInvoice: ', error.message)
        // console.log('Error en createInvoice: ', error)
    }
}