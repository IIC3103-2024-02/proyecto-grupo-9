'use server'

import { getOrderToken } from "@/lib/orderToken";

export async function updateOrder({orderId, estado}: {orderId: string, estado: string }) {
    try {
        const token = await getOrderToken();
        const body = {
            estado: estado
        }
        const res = await fetch(`${process.env.API_URI}/ordenes-compra/ordenes/${orderId}/estado`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.error(`Error ${res.status}: ${res.statusText}`);
            return null;
        }

        return 'ok';
    } catch (error: any) {
        console.log("Error updating order");
        return null;
    }
}