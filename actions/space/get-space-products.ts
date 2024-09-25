'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

interface getSpaceProducts {
    _id: string;
    sku: string;
    store: string;
    expiresAt: Date; 
}

export async function getSpaceProducts(storeId: string, sku: string) {
    try {
        const token = await fetchToken();

        const res = await axios.get(`${process.env.API_URI}/spaces/${storeId}/products?sku=${sku}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // order data by expiration date
        res.data.sort((a: getSpaceProducts, b: getSpaceProducts) => {
            return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        });
        
        return res.data;
    } catch (error: any) {
        //console.log(error);
        console.log("Error al solicitar productos en el espacio ", storeId, ": ", sku);
        return null;
    }
}