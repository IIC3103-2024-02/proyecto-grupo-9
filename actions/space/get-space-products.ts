'use server'

import axios from "axios"
import { fetchToken } from "@/lib/coffeeshopToken"

interface getSpaceProducts {
    _id: string;
    sku: string;
    store: string;
    expiresAt: Date; 
}

export async function getSpaceProducts(storeId: string, sku: string, limit: number = 100) {
    try {
        const token = await fetchToken();

        const res = await fetch(`${process.env.API_URI}/coffeeshop/spaces/${storeId}/products?sku=${sku}&limit=${limit}`,
            {   
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const products = await res.json();

        // order data by expiration date
        products.sort((a: getSpaceProducts, b: getSpaceProducts) => {
            return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        });

        if (products.length === null) {
            console.log("No hay productos en el espacio ", storeId, ": ", sku);
            return [];
        }
        
        return products as getSpaceProducts[];
    } catch (error: any) {
        //console.log(error);
        console.log("Error al solicitar productos en el espacio ", storeId, ": ", sku);
        return null;
    }
}