'use server'

import { requestProducts } from "../product/request-products";
import { getSpaceCountByName } from "../space/get-count-by-name";
import { spaceIds, ingredientsPreparation, recipeProducts } from "../product/constants";
import { tryToMoveManyIngredients } from "./move-ingedients";
import { IOrder } from "@/models/Order";
import Product from "@/models/Product";


export async function prepareIngredients() {
    const kitchen = await getSpaceCountByName('kitchen');
    let ingredients = [];
    for (const { sku, base, quantity, verify } of ingredientsPreparation) {
        const n_base = kitchen?.[base] || 0;
        if (n_base > 0) {
            console.log('Preparando ', sku, '...')
            requestProducts({ sku: sku, quantity: n_base * quantity });
            ingredients.push({ sku, verify});
        }
    }
    await Promise.all(ingredients.map(async ingredient => {waitARequestedProduct(ingredient.sku, ingredient.verify, "kitchen")}));
}

export async function cook(order: IOrder) {
    console.log('Cocinando... ')
    for (const product of order.products) {
        if (product.sku === 'KUCHENMANZANANUEZTROZO' || product.sku === 'CHEESECAKEPORCION') {
            await tryToMoveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: "kitchen", destiny: "checkOut" });

        } else if (recipeProducts.includes(product.sku)) {
            const response = await requestProducts({ sku: product.sku, quantity: product.quantity });
            if (!response) {
                console.log('No se pudo solicitar el producto ', product.sku);
                console.log(response)
                return;
            }
            await waitARequestedProduct(product.sku, product.quantity, "kitchen");
            await tryToMoveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: "kitchen", destiny: "checkOut" });
            await sleep(2000);
        }
    }
}


async function waitARequestedProduct(sku: string, quantity: number, spaceName: keyof typeof spaceIds) {
    const product = await Product.findOne({sku: sku});
    const waitTime = product.production.time*1000*60+5*1000;
    console.log('Esperando ', waitTime/1000, ' segundos ...')
    
    await sleep(waitTime);
    
    let space = await getSpaceCountByName(spaceName);
    
    let count = space?.[sku] || 0;
    let attempts = 0
    console.log('Cantidad de', sku, 'en', spaceName, ':', count)
    while (count < quantity && attempts < 20) {
        console.log('Esperando ', product.sku, '... intento ', attempts)
        await sleep(60*1000)
        space = await getSpaceCountByName(spaceName);
        count = space?.[sku] || 0;
        attempts++
    }
}


export default async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}