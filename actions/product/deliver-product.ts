'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

export async function deliverProduct(orderId: string, productId: string) {
    try {
        const token = await fetchToken();
        console.log("Entregando producto ", productId, " en la orden ", orderId);
        const res = await axios.post(`${process.env.API_URI}/dispatch`,
            {
                "orderId": orderId,
                "productId": productId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Producto ", productId, " entregado exitosamente");
        return res.data;
    } catch (error: any) {
        if (error.response) {
            // Print the entire error response body
            console.log('Error response body:', error.response.data);
        } else {
            // If no response, print the general error message
            console.log('Error message:', error.message);
        }
        console.log('Error al entregar producto ', productId, ' en la orden ', orderId);
        return null;
        
    }
}