'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

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

        return res.data;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}