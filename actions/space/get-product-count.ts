'use server'

import { fetchToken } from "@/lib/token";
import axios from "axios"

export async function getProductCount(storeId: string) {
    try {
        const token = await fetchToken();
        const res = await axios.get(`${process.env.API_URI}/spaces/${storeId}/inventory`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-store'
                }
            }
        );
        
        return res.data;
    } catch (error: any) {
        //onsole.log(error);
        console.log("Error al solicitar conteo de productos en ", storeId);
        return null;
    }
}