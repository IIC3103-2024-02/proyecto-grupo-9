'use server'

import { deliverProduct } from "../product/deliver-product";
import { requestProducts } from "../product/request-products";
import { getSpaceProducts } from "../space/get-space-products";
import { getSpaceCountByName } from "../space/get-count-by-name";
import { getSpaceIds } from "../space/spaces-id";
import { moveManyIngredients } from "./move-ingedients";
import Order, { IOrder } from "@/models/Order";
import Product from "@/models/Product";
import connectDB from "@/lib/db";


export async function splitMilk() {
    const kitchen = await getSpaceCountByName('kitchen');
    const n_wholeMilk = kitchen?.['LECHEENTERA'] || 0;
    if (n_wholeMilk > 0) {
        console.log('Separando leche')
        await requestProducts({ sku: 'LECHEENTERAPORCION', quantity: n_wholeMilk * 12 });
        await waitARequestedProduct('LECHEENTERAPORCION', 12, "kitchen");
    }
}

export async function grindCoffee() {
    const kitchen = await getSpaceCountByName('kitchen');
    const n_CoffeeBeans = kitchen?.['CAFEGRANO'] || 0;
    if (n_CoffeeBeans > 0) {
        console.log('Moliendo café')
        await requestProducts({ sku: 'CAFEMOLIDOPORCION', quantity: n_CoffeeBeans * 20 });
        await waitARequestedProduct('CAFEMOLIDOPORCION', 20, "kitchen");
    }
}

export async function cook(order: IOrder) {
    console.log('Cocinando... ')
    for (const product of order.products) {
        if (product.sku !== 'ENDULZANTESACHET' && product.sku !== 'AZUCARSACHET') {
            const response = await requestProducts({ sku: product.sku, quantity: product.quantity });
            if (!response) {
                console.log('No se pudo solicitar el producto ', product.sku);
                console.log(response)
                return;
            }
            await waitARequestedProduct(product.sku, product.quantity, "kitchen");
            await moveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: "kitchen", destiny: "checkOut" });
        }
    }
}

export async function deliver(order: IOrder) {
    console.log('Entregando productos...')
    const spaceIds = await getSpaceIds();
    for (const product of order.products) {
        const readyProducts = await getSpaceProducts(spaceIds["checkOut"], product.sku);
        if (readyProducts && readyProducts.length >= product.quantity) {
            for (let i = 0; i < product.quantity; i++) {
                await connectDB();
                order.dispatched += 1;
                await deliverProduct(order._id, readyProducts[i]._id);
            }
        } else {
            console.log('Not enough ready products found in checkOut');
        }
    }
    await order.save();
}

export async function markOrderAsDone(orderId: string) {
    const order = await Order.findById(orderId);
    order.status = 'delivered';
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

    let space = await getSpaceCountByName(spaceName);

    let count = space?.[sku] || 0;
    let attempts = 0
    console.log('Cantidad de', sku, 'en', spaceName, ':', count)
    while (count < quantity) {
        console.log('Esperando ', product.sku, '... intento ', attempts)
        await sleep(30*1000)
        space = await getSpaceCountByName(spaceName);
        count = space?.[sku] || 0;
        attempts++
    }
}
