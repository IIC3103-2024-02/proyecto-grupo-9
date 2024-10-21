'use server'

import { getOrderToken } from "@/lib/orderToken";

export interface ApiOrder {
    id: string;
    creada: Date;
    actualizada: Date;
    cliente: string;
    proveedor: string;
    sku: string;
    cantidad: number;
    despachado: number;
    estado: "creada" | "aceptada" | "rechazada" | "anulada" | "vencida" | "cumplida";
    historial: [{
        nombre: string;
        fecha: Date;
    }];
    vencimiento: Date;
}
export async function getOrder({orderId}: {orderId: string}) {
    try {
        const token = await getOrderToken();
        const res = await fetch(`${process.env.API_URI}/ordenes-compra/ordenes/${orderId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });

        if (!res.ok) {
            console.error(`Error ${res.status}: ${res.statusText}`);
            return null;
        }
        return await res.json() as ApiOrder;
    } catch (error: any) {
        console.log("Error al solicitar ordenes");
        return null;
    }
}