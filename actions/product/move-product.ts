'use server'

import { fetchToken } from "@/lib/coffeeshopToken"

export async function moveProduct(storeId: string, productId: string) {
    try {
        const token = await fetchToken();
      
        const res = await fetch(`${process.env.API_URI}/coffeeshop/products/${productId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ store: storeId }),
        });
  
        if (!res.ok) {
            const errorData = await res.json(); // Parse error response
            console.log(errorData);
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
  
        console.log("Se movió el producto", productId, "al espacio", storeId);
        return await res.json(); // Parse response data
    } catch (error: any) {
        console.log("Error al mover producto", productId, "al espacio", storeId);
        console.error(error.message);
        return null;
    }
}
  

