'use server'

import { fetchToken } from "@/lib/token";
import axios from "axios"

export async function getProductCount(storeId: string) {
    try {
        const token = fetchToken();
        const res = await axios.get(`${process.env.API_URI}/spaces/${storeId}/inventory`,
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