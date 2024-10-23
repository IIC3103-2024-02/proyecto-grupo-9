'use server'

import { getOrderToken } from "@/lib/orderToken";
import { ApiOrder } from "./get-order";

interface createOrderProps {
    cliente: string;
    proveedor: string;
    sku: string;
    cantidad: number;
    vencimiento: Date;
}

export async function createOrder({ cliente, proveedor, sku, cantidad, vencimiento }: createOrderProps) {
    try {
        const token = await getOrderToken();
        const body = {
            cliente: cliente,
            proveedor: proveedor,
            sku: sku,
            cantidad: cantidad,
            vencimiento: vencimiento
        }
        const res = await fetch(`${process.env.API_URI}/ordenes-compra/ordenes`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });


        if (!res.ok) {
            console.error(`Error ${res.status}: ${res.statusText}`);
            const errorBody = await res.json();
            console.error('Error details:', errorBody);
            return null;
        }

        const data = await res.json();

        return data as ApiOrder;
    } catch (error: any) {
        console.error(error);
        console.log("Error creating order");
        return null;
    }
}