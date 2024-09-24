'use server'

import connectDB from "@/lib/db"
import Order from "@/models/Order"

export async function makeOrder(orderId: string) {
    try {
        await connectDB();

        const order = await Order.findById(orderId);

        for (const product of order.products) {
            
        }
        
        return {
            status: 'Aceptado'
        };
        
    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
}