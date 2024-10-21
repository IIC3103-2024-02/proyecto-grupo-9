'use server'

import { deliverProduct } from "../product/deliver-product";
import { requestProducts } from "../product/request-products";
import { getSpaces } from "../space/get-spaces";
import { getSpaceProducts } from "../space/get-space-products";
import { moveManyIngredients } from "./move-ingedients";
import Order, { IOrder } from "@/models/Order";
import Product from "@/models/Product";


export async function splitMilk() {
    console.log('Separando leche')
    const spaces = await getSpaces();
    const n_wholeMilk = spaces.kitchen.skuCount['LECHEENTERA'] || 0;
    if (n_wholeMilk > 0) {
        await requestProducts({ sku: 'LECHEENTERAPORCION', quantity: n_wholeMilk * 12 });
        await waitARequestedProduct('LECHEENTERAPORCION', 12, "kitchen");
    }
}

export async function grindCoffee() {
    console.log('Moliendo café')
    const spaces = await getSpaces();
    const n_CoffeeBeans = spaces.kitchen.skuCount['CAFEGRANO'] || 0;
    if (n_CoffeeBeans > 0) {
        await requestProducts({ sku: 'CAFEMOLIDOPORCION', quantity: n_CoffeeBeans * 20 });
        await waitARequestedProduct('CAFEMOLIDOPORCION', 20, "kitchen");
    }
}

export async function cookAndDeliver(order: IOrder) {
    console.log('Cocinando y entregando')
    const spaces = await getSpaces();
    for (const product of order.products) {
        if (product.sku !== 'ENDULZANTESACHET' && product.sku !== 'AZUCARSACHET') {
            const response = await requestProducts({ sku: product.sku, quantity: product.quantity });
            if (!response) {
                console.log('No se pudo solicitar el producto ', product.sku);
                console.log(response)
                return;
            }
            await waitARequestedProduct(product.sku, product.quantity, "kitchen");
            await moveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: spaces.kitchen, destiny: spaces.checkOut });
        }
        const readyProducts = await getSpaceProducts(spaces.checkOut.id, product.sku);
        if (readyProducts) {
            for (let i = 0; i < product.quantity; i++) {
                await deliverProduct(order._id, readyProducts[i]._id);
            }
            markOrderAsDone(order._id);
        } else {
            console.log('No ready products found in checkOut');
        }
    }
}

async function markOrderAsDone(orderId: string) {
    const order = await Order.findById(orderId);
    order.status = 'ready';
    await order.save();
}

export default async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitARequestedProduct(sku: string, quantity: number, spaceName: string) {
    const product = await Product.findOne({sku: sku});
    const waitTime = product.production.time*1000*60+1000;
    console.log('Esperando ',waitTime / 1000, ' segundos ...')

    await sleep(waitTime);

    let spaces = await getSpaces();
    let space = spaces[spaceName];
    let count = space.skuCount[sku] || 0;
    let attempts = 0
    console.log('Cantidad de', sku, 'en', spaceName, ':', count)
    while (count < quantity) {
        console.log('Esperando ', product.sku, ' ... intento ', attempts)
        await sleep(30*1000)
        spaces = await getSpaces();
        space = spaces[spaceName];
        count = space.skuCount[sku] || 0;
        attempts++
    }
}
