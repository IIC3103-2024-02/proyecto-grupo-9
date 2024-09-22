'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

export async function getSpaceProducts(storeId: string) {
    try {
        const token = fetchToken();
        const res = await axios.get(`${process.env.API_URI}/spaces/${storeId}/products`,
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