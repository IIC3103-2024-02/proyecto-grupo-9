'use server'

import { requestProductInterface } from "../product/request-products";
import connectDB from "@/lib/db";
import Product from "@/models/Product";


export async function waitForProductAvailability(response: requestProductInterface) {

    if (response && response.availableAt) {
        const availableAt = new Date(response.availableAt);
        const createdAt = new Date(response.createdAt);
        await connectDB()
        const product = await Product.findOne({ sku: response.sku})

        const waitTime = product.production.time * response.quantity * 60000// Time difference in milliseconds

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