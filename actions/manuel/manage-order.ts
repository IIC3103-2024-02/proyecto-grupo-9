'use server'

import connectDB from "@/lib/db"
import Order, { IOrder } from "@/models/Order"
import Product, { IProduct } from "@/models/Product"
import { getSpaces, SpaceData } from "../space/get-spaces";
import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";
import { stockUp } from "./stock-up";
import { requestProducts } from "../product/request-products";
import { deliverProduct } from "../product/deliver-product";
import { getProductCount } from "../space/get-product-count";

export async function manageOrder(orderId: string) {
    try {
        console.log('---------------------------------------- Gestionando orden -----------------------------------------')
        await connectDB();
        const order = await Order.findById(orderId);
        console.log('Orden encontrada: ', order)

        await setKitchen(order);
        if (order.products.some((product: {'sku': string, 'quantity': number}) => product.sku === 'AZUCARSACHET' || product.sku === 'ENDULZANTESACHET')) {
            // If any product in the array matches AZUCARSACHET or ENDULZANTESACHET
            console.log('Orden contiene AZUCARSACHET o ENDULZANTESACHET');
        } else {
            // If no matching product is found
            await splitMilk();
            await grindCoffee();
        }
        
        cookAndDeliver(order);
        stockUp();
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
        // stockUp();
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
        'ENDULZANTESACHET': 0,
        'AZUCARSACHET': 0
    };

    for (const product of order.products) {
        const productData = products.find(p => p.sku === product.sku);
        if (productData.sku === 'ENDULZANTESACHET' || productData.sku === 'AZUCARSACHET') {
            necessary_ingredients[productData.sku] += product.quantity;
            continue;
        }
        for (const ingredient of productData.recipe) {
            necessary_ingredients[`${ingredient.sku}`] += ingredient.req * product.quantity;
        }
    }
    console.log('\n----------------\nIngredientes necesarios:', necessary_ingredients, '\n')
    return necessary_ingredients;
}

async function whatDoIHave() {
    const spaces = await getSpaces();

    const available_ingredients: Record<string, number> = {
        'CAFEMOLIDOPORCION': spaces.kitchen.skuCount['CAFEMOLIDOPORCION'] || 0,
        'LECHEENTERAPORCION': spaces.kitchen.skuCount['LECHEENTERAPORCION'] || 0,
        'VASOCAFE': spaces.kitchen.skuCount['VASOCAFE'] || 0,
        'VASOCAFEDOBLE': spaces.kitchen.skuCount['VASOCAFEDOBLE'] || 0,
        'VASOCAFEEXPRESO': spaces.kitchen.skuCount['VASOCAFEEXPRESO'] || 0,
        'ENDULZANTESACHET': spaces.checkIn.skuCount['ENDULZANTESACHET'] || spaces.buffer.skuCount['ENDULZANTESACHET'] || 0,
        'AZUCARSACHET': spaces.checkIn.skuCount['AZUCARSACHET'] || spaces.buffer.skuCount['AZUCARSACHET'] || 0
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
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: spaces.buffer, destiny: spaces.kitchen });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
}

async function requestIngredientsToCheckIn(missing_ingredients: Record<string, number>) {
    const spaces = await getSpaces();
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: spaces.checkIn, destiny: spaces.kitchen });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
}

async function moveManyIngredients({ sku, quantity, origin, destiny }: { sku: string, quantity: number, origin: SpaceData, destiny: SpaceData }) {
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
    const n_wholeMilk = spaces.kitchen.skuCount['LECHEENTERA'] || 0;
    if (n_wholeMilk > 0) {
        await requestProducts({ sku: 'LECHEENTERAPORCION', quantity: n_wholeMilk * 12 });
        await waitARequestedProduct('LECHEENTERAPORCION', 12, "kitchen");
    }
}

async function grindCoffee() {
    console.log('Moliendo café')
    const spaces = await getSpaces();
    const n_CoffeeBeans = spaces.kitchen.skuCount['CAFEGRANO'] || 0;
    if (n_CoffeeBeans > 0) {
        await requestProducts({ sku: 'CAFEMOLIDOPORCION', quantity: n_CoffeeBeans * 20 });
        await waitARequestedProduct('CAFEMOLIDOPORCION', 20, "kitchen");
    }
}

async function cookAndDeliver(order: IOrder) {
    console.log('Cocinando y entregando')
    const spaces = await getSpaces();
    for (const product of order.products) {
        if (product.sku === 'ENDULZANTESACHET' || product.sku === 'AZUCARSACHET') {
            const move = await moveManyIngredients({ sku: product.sku, quantity: product.quantity, origin: spaces.buffer, destiny: spaces.checkOut });
            if (move < product.quantity) {
                await moveManyIngredients({ sku: product.sku, quantity: product.quantity - move, origin: spaces.checkIn, destiny: spaces.checkOut });
            }
        } else {
            await requestProducts({ sku: product.sku, quantity: product.quantity });
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

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitARequestedProduct(sku: string, quantity: number = 1, spaceName: string) {
    const product = await Product.findOne({sku: sku});
    console.log('Esperando ', product.sku, ' ...')

    await sleep(product.production.time*1000*60+1000);

    let spaces = await getSpaces();
    let space = spaces[spaceName];
    let attempts = 0
    while (space.skuCount[sku] < quantity && attempts < 12) {
        console.log('Esperando ', product.sku, ' ... intento ', attempts)
        await sleep(30*1000)
        spaces = await getSpaces();
        space = spaces[spaceName];
        attempts++
    }
    
}
