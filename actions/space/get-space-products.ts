
import axios from "axios"
import { fetchToken } from "@/lib/token"

interface getSpaceProducts {
    _id: string;
    sku: string;
    store: string;
    expiresAt: Date; 
}

export const revalidate = 0;

export async function getSpaceProducts(storeId: string, sku: string) {
    try {
        const token = await fetchToken();

        const res = await axios.get(`${process.env.API_URI}/spaces/${storeId}/products?sku=${sku}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-store'
                }
            }
        );
        const products = res.data;

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