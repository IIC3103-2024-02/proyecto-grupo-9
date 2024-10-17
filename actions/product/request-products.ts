'use server'

import axios from "axios"
import { fetchToken } from "@/lib/coffeeshopToken"

export interface requestProductInterface {
    _id: string;
    createdAt: string;
    updatedAt: string;
    sku: string;
    group: number;
    checkedOut: boolean;
    availableAt: string;
    quantity: number;
}

export async function requestProducts({ sku, quantity }: { sku: string, quantity: number }) {
    try {
        const token = await fetchToken();
        const res = await axios.post(`${process.env.API_URI}/coffeeshop/products`,
            {
                "sku": sku,
                "quantity": quantity
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        console.log("Solicitando productos ", sku, ": ", quantity);
        return res.data as requestProductInterface;
    } catch (error: any) {
        console.log("Error al solicitar productos ", sku, ": ", quantity);
        console.log(error.response.data);
        return null;
    }
}