'use server'

import axios from "axios"
import { fetchToken } from "@/lib/coffeeshopToken"

export async function sendProduct(productId: string, group: number) {
    try {
        const token = await fetchToken();
        const res = await axios.post(`${process.env.API_URI}/coffeeshop/products/${productId}/group`,
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
        //console.log(error.message);
        console.log("Error al enviar producto ", productId, " al grupo ", group);
        return null;
    }
}