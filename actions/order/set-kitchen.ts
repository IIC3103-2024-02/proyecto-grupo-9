'use server'

import { IOrder } from "@/models/Order";
import Product from "@/models/Product";
import { getSpaceCountByName } from "../space/get-count-by-name";
import { moveManyIngredients } from "./move-ingedients";


export async function setKitchen(order: IOrder) {
    const necessary_ingredients = await whatDoINeed(order);
    const available_ingredients = await whatDoIHave();
    if ('error' in available_ingredients) {
        console.log(available_ingredients.error);
        return;
    }

    let missing_ingredients = await getMissingIngredients(necessary_ingredients, available_ingredients);
    missing_ingredients = await requestIngredientsToBuffer(missing_ingredients);
    missing_ingredients = await requestIngredientsToCheckIn(missing_ingredients);
    if (!checkKitchen(missing_ingredients)) {
        console.log('No se pudieron mover todos los ingredientes a cocina')
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
    const kitchen = await getSpaceCountByName('kitchen');

    const available_ingredients: Record<string, number> = {
        'CAFEMOLIDOPORCION': kitchen?.['CAFEMOLIDOPORCION'] || 0,
        'LECHEENTERAPORCION': kitchen?.['LECHEENTERAPORCION'] || 0,
        'VASOCAFE': kitchen?.['VASOCAFE'] || 0,
        'VASOCAFEDOBLE': kitchen?.['VASOCAFEDOBLE'] || 0,
        'VASOCAFEEXPRESO': kitchen?.['VASOCAFEEXPRESO'] || 0,
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
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: "buffer", destiny: "kitchen" });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
}

async function requestIngredientsToCheckIn(missing_ingredients: Record<string, number>) {
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: "checkIn", destiny: "kitchen" });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
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
