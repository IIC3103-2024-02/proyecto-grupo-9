'use server'

import { fetchToken } from "@/lib/coffeeshopToken"

export async function deliverProduct(orderId: string, productId: string) {
    try {
        const token = await fetchToken();

        const res = await fetch(`${process.env.API_URI}/coffeeshop/dispatch`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId,
                orderId: orderId
            }),
        });

        if (!res.ok) {
            throw new Error(`Failed to dispatch product: ${res.status} ${res.statusText}`);
        }

        if (res.status === 204) {
            console.log('Producto entregado ', productId, ' en la orden ', orderId);
        }

        return;

    } catch (error: any) {
        if (error.response) {
            // Print the entire error response body
            console.log('Error response body:', error.response.data);
        } else {
            // If no response, print the general error message
            console.log('Error message:', error.message);
        }
        console.error(error);
        console.log('Error al entregar producto ', productId, ' en la orden ', orderId);
        return null;
        
    }
}