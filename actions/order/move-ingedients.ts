'use server'

import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";
import { spaceIds } from "../product/constants";
import sleep from "./cooking";


export async function tryToMoveManyIngredients({ sku, quantity, origin, destiny }: 
    { sku: string, quantity: number, origin: keyof typeof spaceIds, destiny: keyof typeof spaceIds }) {

    try {
        console.log('Intentando mover ', quantity, ' ', sku, ' desde ', origin, ' a ', destiny)
        const products = await getSpaceProducts(spaceIds[origin], sku);
        if (!products) {
            throw new Error('No se pudieron obtener los productos');
        }

        if (products.length >= quantity) {
            for (let i = 0; i < quantity; i++) {
                await moveProduct(spaceIds[destiny], products[i]._id);
                console.log('Moviendo producto ' + products[i].sku + ' desde ' + origin + ' a ' + destiny);
            }
            console.log('Se movieron ' + quantity + ' ' + sku + '. Solicitud completada.');
            return quantity;
        } else if (products.length === 0) {
            console.log('No hay ', sku, ' en ', origin);
            return 0;
        } else {
            for (let i = 0; i < products.length; i++) {
                await moveProduct(spaceIds[destiny], products[i]._id);
                console.log('Moviendo producto ' + products[i].sku + ' desde ' + origin + ' a ' + destiny);
            }
            console.log('Se movieron ' + products.length + ' ' + sku + '. Falta mover ', quantity - products.length);
            return products.length;
        }

    } catch (error: any) {
        console.log(error.message);
        return 0;
    }
}

export async function moveManyIngredients({ sku, quantity, origin, destiny }:
    { sku: string, quantity: number, origin: keyof typeof spaceIds, destiny: keyof typeof spaceIds }) {
    try {
        console.log('Moveiendo ', quantity, ' ', sku, ' desde ', origin, ' a ', destiny)
        const products = await getSpaceProducts(spaceIds[origin], sku);
        if (!products) {
            throw new Error('No se pudieron obtener los productos');
        }

        for (let i = 0; i < quantity; i++) {
            await moveProduct(spaceIds[destiny], products[i]._id);
            sleep(5000);
        }
        console.log('Se movieron ' + quantity + ' ' + sku + '. Solicitud completada.');
    } catch (error: any) {
        console.log(error.message);
        return 0;
    }
}
