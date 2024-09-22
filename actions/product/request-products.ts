'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

export async function requestProducts({ sku, quantity }: { sku: string, quantity: number }) {
    try {
        const token = fetchToken();
        const res = await axios.post(`${process.env.API_URI}/products`,
            {
                "sku": sku,
                "quantity": quantity
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        
        return res.data;
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}