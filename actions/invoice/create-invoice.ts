'use server'

import connectDB from "@/lib/db"
import Invoice from "@/models/Invoice"
import { emitInvoiceAsync } from "@/lib/soap"

export async function createInvoice(orderId: string) {
    try {
        console.log('---------------------------------------- Creando factura -----------------------------------------')
        await connectDB();
        const billingDetails = await emitInvoiceAsync(orderId);
        const invoice = await Invoice.create(billingDetails);
        console.log('Factura creada: ', invoice)
    } catch (error) {
        console.log('Error en createInvoice: ', error)
    }
}