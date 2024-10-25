'use server'

import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";
import { getSpaces } from "../space/get-spaces";
import { IOrder } from "@/models/Order";
import { getSpaceIds } from "../space/spaces-id";


export async function moveManyIngredients({ sku, quantity, origin, destiny }: { sku: string, quantity: number, origin: string, destiny: string }) {
    try {
        const spaces = await getSpaceIds();
        console.log('Intentando mover ', quantity, ' ', sku, ' desde ', origin, ' a ', destiny)
        const products = await getSpaceProducts(spaces[origin], sku);
        if (!products) {
            throw new Error('No se pudieron obtener los productos');
        }

        if (products.length >= quantity) {
            for (let i = 0; i < quantity; i++) {
                await moveProduct(spaces[destiny], products[i]._id);
                console.log('Moviendo producto ', products[i].sku, ' desde ', origin, ' a ', destiny);
            }
            return quantity;
        } else if (products.length === 0) {
            console.log('No hay ', sku, ' en ', origin);
            return 0;
        } else {
            for (let i = 0; i < products.length; i++) {
                await moveProduct(spaces[destiny], products[i]._id);
                console.log('Moviendo producto ', products[i].sku + ' desde ' + origin + ' a ' + destiny);
            }
            return products.length;
        }

    } catch (error: any) {
        console.log(error.message);
        return 0;
    }
}


export async function moveSugarAndSweetener(order: IOrder) {
    for (const product of order.products) {
        if (product.sku === 'AZUCARSACHET' || product.sku === 'ENDULZANTESACHET') {
            const move_buff = await moveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: "buffer", destiny: "checkOut" });
            if (move_buff < product.quantity) {
                const move_chckin = await moveManyIngredients({ sku: product.sku, quantity: product.quantity - move_buff, origin: "checkIn", destiny: "checkOut" });
                if (move_chckin + move_buff < product.quantity) {
                    console.log(`No hay suficientes ${product.sku} en el buffer ni en el checkIn`);
                }
            }
        }
    }
}