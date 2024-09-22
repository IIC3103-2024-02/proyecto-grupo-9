'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

export async function sendProduct(productId: string, group: number) {
    try {
        const token = fetchToken();
        const res = await axios.post(`${process.env.API_URI}/products/${productId}/group`,
            {
                "group": group
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