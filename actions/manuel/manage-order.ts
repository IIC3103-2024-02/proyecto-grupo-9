'use server'

import connectDB from "@/lib/db"
import Order, { IOrder } from "@/models/Order"
import Product, { IProduct } from "@/models/Product"
import { getSpaces } from "../space/get-spaces";
import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";
import { stockUp } from "./stock-up";
import { requestProducts } from "../product/request-products";
import { deliverProduct } from "../product/deliver-product";

export async function manageOrder(orderId: string) {
    try {
        console.log('------------------------------ Gestionando orden -------------------------------')
        await connectDB();
        const order = await Order.findById(orderId);
        console.log('Orden encontrada: ', order)

        await setKitchen(order);
        splitMilk();
        grindCoffee();
        cookAndDeliver(order);
        //markOrderAsDone(orderId);
    }
    catch (error) {
        console.log('Error en manageOrder: ', error)
    }
}

async function setKitchen(order: IOrder) {
    const necessary_ingredients = await whatDoINeed(order);
    const available_ingredients = await whatDoIHave();
    if ('error' in available_ingredients) {
        console.log(available_ingredients.error);
        return;
    }

    const missing_ingredients = await getMissingIngredients(necessary_ingredients, available_ingredients);
    const missing_ingredients2 = await requestIngredientsToBuffer(missing_ingredients);
    if ('error' in missing_ingredients2) {
        console.log(missing_ingredients2.error);
        return
    }
    const missing_ingredients3 = await requestIngredientsToCheckIn(missing_ingredients2);
    if ('error' in missing_ingredients3) {
        console.log(missing_ingredients3.error);
        return
    } else if (!checkKitchen(missing_ingredients3)) {
        console.log('No se pudieron mover todos los ingredientes a cocina')
        stockUp();
        return;
    }
}

async function whatDoINeed(order: IOrder) {
    const products = await Product.find();
    const necessary_ingredients: Record<string, number> = {
        'CAFEMOLIDOPORCION': 0,
        'LECHEENTERAPORCION': 0,
        'VASOCAFE': 0,
        'VASOCAFEDOBLE': 0,
        'VASOCAFEEXPRESO': 0,
    };

    for (const product of order.products) {
        const productData = products.find(p => p.sku === product.sku);
        for (const ingredient of productData.recipe) {
            necessary_ingredients[`${ingredient.sku}`] += ingredient.req * product.quantity;
        }
    }
    console.log('\n----------------\nIngredientes necesarios:', necessary_ingredients, '\n')
    return necessary_ingredients;
}

async function whatDoIHave() {
    const spaces = await getSpaces();
    console.log('Espacios: ', spaces)
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }

    const available_ingredients: Record<string, number> = {
        'CAFEMOLIDOPORCION': spaces.kitchen.skuCount['CAFEMOLIDOPORCION'] || 0,
        'LECHEENTERAPORCION': spaces.kitchen.skuCount['LECHEENTERAPORCION'] || 0,
        'VASOCAFE': spaces.kitchen.skuCount['VASOCAFE'] || 0,
        'VASOCAFEDOBLE': spaces.kitchen.skuCount['VASOCAFEDOBLE'] || 0,
        'VASOCAFEEXPRESO': spaces.kitchen.skuCount['VASOCAFEEXPRESO'] || 0,
    };

    console.log('\n-----------------\nIngredientes disponibles: ', available_ingredients, '\n')
    return available_ingredients;
}

async function getMissingIngredients(necessary_ingredients: Record<string, number>, available_ingredients: Record<string, number>) {
    const missing_ingredients: Record<string, number> = {};

    for (const ingredient in necessary_ingredients) {
        if (necessary_ingredients[ingredient] > available_ingredients[ingredient]) {
            const difference = necessary_ingredients[ingredient] - available_ingredients[ingredient];
            if (difference > 0) {
                missing_ingredients[ingredient] = difference;
            }
        }
    }
    if (missing_ingredients['CAFEMOLIDOPORCION']) {
        missing_ingredients['CAFEGRANO'] = Math.floor(missing_ingredients['CAFEMOLIDOPORCION'] / 20) + 1;
        delete missing_ingredients['CAFEMOLIDOPORCION'];
    }
    if (missing_ingredients['LECHEENTERAPORCION']) {
        missing_ingredients['LECHEENTERA'] = Math.floor(missing_ingredients['LECHEENTERAPORCION'] / 12) + 1;
        delete missing_ingredients['LECHEENTERAPORCION'];
    }

    console.log('\n-----------------\nIngredientes faltantes: ', missing_ingredients, '\n')
    return missing_ingredients;
}

async function requestIngredientsToBuffer(missing_ingredients: Record<string, number>) {
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    const buffer = spaces.buffer.id;
    const kitchen = spaces.kitchen.id;
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: buffer, destiny: kitchen });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
}

async function requestIngredientsToCheckIn(missing_ingredients: Record<string, number>) {
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    const checkIn = spaces.checkIn.id;
    const kitchen = spaces.kitchen.id;
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: checkIn, destiny: kitchen });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
}

async function moveManyIngredients({ sku, quantity, origin, destiny }: { sku: string, quantity: number, origin: string, destiny: string }) {
    try {
        const products = await getSpaceProducts(origin, sku);
        if (!products) {
            return {
                error: 'No se pudieron obtener los productos de ', origin
            };
        }
        if (products.length >= quantity) {
            for (let i = 0; i < quantity; i++) {
                await moveProduct(destiny, products[i]._id);
                console.log('Moviendo producto ', products[i].sku, ' desde ', origin, ' a ', destiny);
            }
            return quantity;
        } else if (products.length === 0) {
            console.log('No hay ', sku, ' en ', origin);
            return 0;
        } else {
            for (let i = 0; i < products.length; i++) {
                await moveProduct(destiny, products[i]._id);
                console.log('Moviendo producto ', products[i].sku + ' desde ' + origin + ' a ' + destiny);
            }
            return products.length;
        }
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}

function checkKitchen(missing_ingredients: Record<string, number>) {
    for (const ingredient in missing_ingredients) {
        if (missing_ingredients[ingredient] > 0) {
            console.log('Faltan ', missing_ingredients[ingredient], ' ', ingredient, ' en cocina')
            return false;
        }
    }
    return true;
}

async function splitMilk() {
    console.log('Separando leche')
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    const n_wholeMilk = spaces.kitchen.skuCount['LECHEENTERA'] || 0;
    await requestProducts({ sku: 'LECHEENTERAPORCION', quantity: n_wholeMilk * 12 });
}

async function grindCoffee() {
    console.log('Moliendo café')
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    const n_CoffeeBeans = spaces.kitchen.skuCount['CAFEGRANO'] || 0;
    await requestProducts({ sku: 'CAFEMOLIDOPORCION', quantity: n_CoffeeBeans * 20 });
    await waitARequestedProduct('CAFEMOLIDOPORCION');
}

async function cookAndDeliver(order: IOrder) {
    console.log('Cocinando y entregando')
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    console.log('Espacios: ', spaces)
    const checkOut = spaces.checkOut.id;
    const kitchen = spaces.kitchen.id;
    for (const product of order.products) {
        await requestProducts({ sku: product.sku, quantity: product.quantity });
        await waitARequestedProduct(product.sku);
        await moveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: kitchen, destiny: checkOut });
        const readyProducts = await getSpaceProducts(checkOut, product.sku);
        for (const readyProduct of readyProducts) {
            await deliverProduct(order._id, readyProduct._id);
        }
    }
}

async function markOrderAsDone(orderId: string) {
    const order = await Order.findById(orderId);
    order.deliveryDate = new Date();
    await order.save();
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitARequestedProduct(sku: string) {
    const product = await Product.findOne({sku: sku});
    await sleep(product.production.time*1000*60);
}
