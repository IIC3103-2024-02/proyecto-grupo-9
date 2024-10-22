'use server'

import { getOrderToken } from "@/lib/orderToken";
import { ApiOrder } from "./get-order";

interface createOrderProps {
    cliente: string;
    proveedor: string;
    sku: string;
    cantidad: number;
    vencimiento: string;
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
        const res = await fetch(`https://dev.proyecto.2024-2.tallerdeintegracion.cl/ordenes-compra/ordenes`, {
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

        return await res.json() as ApiOrder;
    } catch (error: any) {
        console.log("Error creating order");
        return null;
    }
}