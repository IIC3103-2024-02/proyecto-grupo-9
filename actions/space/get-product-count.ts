
import { fetchToken } from "@/lib/coffeeshopToken";

export const revalidate = 0;

export async function getProductCount(storeId: string) {
    try {
        const token = await fetchToken();
        const res = await fetch(`${process.env.API_URI}/coffeeshop/spaces/${storeId}/inventory`,
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
        return await res.json();
    } catch (error: any) {
        //console.log(error);
        console.log("Error al solicitar conteo de productos en ", storeId);
        return null;
    }
}