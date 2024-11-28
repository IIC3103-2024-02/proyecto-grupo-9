'use server';

import { createOrder } from "../purchaseOrder/create-order";
import axios from 'axios';

export async function requestProductToAnotherGroup(group: string, sku: string, quantity: number) {
    try {
        const response = await createOrder({
            cliente: "9", 
            proveedor: group, 
            sku: sku,
            cantidad: Number(quantity),
            vencimiento: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        if (response && response.id) { 

            const orderDetails = {
                id: response.id,
                dueDate: response.vencimiento,
                order: [
                    {
                        sku: sku,
                        quantity: Number(quantity)
                    }
                ]
            };

            try {
                const res = await axios.post(`https://granizo${group}.ing.puc.cl/api/orders`, orderDetails, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const { status } = res.data;
                alert(status);
                const ret = {
                    status: status,
                    id: response.id
                }
                return ret;
            } catch (error) {
                console.error('Error al solicitar productos a otro grupo:');
            }

        } else {
            console.error('Error al crear la orden');
        }
    } 
    catch (error) {
        console.error('Error:', error);
    }
}