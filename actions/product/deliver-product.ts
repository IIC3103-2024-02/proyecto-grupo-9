'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

export async function deliverProduct(orderId: string, productId: string) {
    try {
        const token = fetchToken();
        const res = await axios.post(`${process.env.API_URI}/dispatch`,
            {
                "orderId": orderId,
                "productId": productId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}