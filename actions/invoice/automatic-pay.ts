'use server'

import { getInvoicesAsync, payInvoiceAsync } from "@/lib/soap"
import sleep from "../order/cooking";


export async function automaticPay() {
    const invoices = await getInvoicesAsync({
        status: 'pending',
        side: 'client',
        fromDate: '2024-11-27',
        toDate: '2024-11-30'
    });

    for (const invoice of invoices) {
        try {
            await payInvoiceAsync(invoice.id);
            console.log(`Paying invoice ${invoice.id}`);
        } catch (error) {
            console.error(`Error paying invoice ${invoice.id}: ${error}`);
        } 
        await sleep(1000); // Wait 1 second before processing the next invoice
    }

}