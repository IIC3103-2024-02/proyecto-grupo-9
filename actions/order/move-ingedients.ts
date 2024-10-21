'use server'

import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";
import { getSpaces } from "../space/get-spaces";
import { IOrder } from "@/models/Order";
import { SpaceData } from "../space/get-spaces";



export async function moveManyIngredients({ sku, quantity, origin, destiny }: { sku: string, quantity: number, origin: SpaceData, destiny: SpaceData }) {
    try {
        console.log('Intentando mover ', quantity, ' ', sku, ' desde ', origin.name, ' a ', destiny.name)
        const products = await getSpaceProducts(origin.id, sku);
        if (!products) {
            throw new Error('No se pudieron obtener los productos');
        }

        if (products.length >= quantity) {
            for (let i = 0; i < quantity; i++) {
                await moveProduct(destiny.id, products[i]._id);
                console.log('Moviendo producto ', products[i].sku, ' desde ', origin.name, ' a ', destiny.name);
            }
            return quantity;
        } else if (products.length === 0) {
            console.log('No hay ', sku, ' en ', origin.name);
            return 0;
        } else {
            for (let i = 0; i < products.length; i++) {
                await moveProduct(destiny.id, products[i]._id);
                console.log('Moviendo producto ', products[i].sku + ' desde ' + origin.name + ' a ' + destiny.name);
            }
            return products.length;
        }

    } catch (error: any) {
        console.log(error.message);
        return 0;
    }
}


export async function moveSugarAndSweetener(order: IOrder) {
    if (order.products.some((product: {'sku': string, 'quantity': number}) => product.sku === 'AZUCARSACHET' || product.sku === 'ENDULZANTESACHET')) {
        const spaces = await getSpaces();
        for (const product of order.products) {
            if (product.sku === 'AZUCARSACHET' || product.sku === 'ENDULZANTESACHET') {
                const move = await moveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: spaces.buffer, destiny: spaces.checkOut });
                if (move < product.quantity) {
                    await moveManyIngredients({ sku: product.sku, quantity: product.quantity - move, origin: spaces.checkIn, destiny: spaces.checkOut });
                }
            }
        }
    }
}