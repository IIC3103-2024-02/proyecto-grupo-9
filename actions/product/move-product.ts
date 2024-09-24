'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

export async function moveProduct(storeId: string, productId: string) {
    try {
        const token = await fetchToken();
        const res = await axios.patch(`${process.env.API_URI}/products/${productId}`,
            {
                "store": storeId
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