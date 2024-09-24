'use server'

import { requestProductInterface } from "../product/request-products";



export async function waitForProductAvailability(response: requestProductInterface) {

    if (response && response.availableAt) {
        const availableAt = new Date(response.availableAt);
        const now = new Date();

        const waitTime = availableAt.getTime() - now.getTime(); // Time difference in milliseconds

        if (waitTime > 0) {
            console.log('--------------------------------')
            console.log(`Esperando por ${waitTime / 1000} segundos hasta que ${response.sku} este listo .`);
            console.log('--------------------------------')
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`Producto ${response.sku} disponible.`);
                    resolve(availableAt);
                }, waitTime + 5000);
            });
        } else {
            console.log(`Producto ${response.sku} disponible.`);
            return availableAt;
        }
    } else {
        throw new Error('No se pudo obtener la respuesta del producto');
    }
}