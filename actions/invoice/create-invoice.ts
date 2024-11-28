'use server'

import connectDB from "@/lib/db"
import Invoice from "@/models/Invoice"
import { emitInvoiceAsync } from "@/lib/soap"

export async function createInvoice(orderId: string) {
    try {
        await connectDB();
        const billingDetails = await emitInvoiceAsync(orderId);
        await Invoice.create(billingDetails);
    } catch (error) {
        console.log('Error en createInvoice: ')
        // console.log('Error en createInvoice: ', error)
    }
}