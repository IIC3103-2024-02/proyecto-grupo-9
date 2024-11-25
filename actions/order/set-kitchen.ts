'use server'

import { IOrder } from "@/models/Order";
import Product from "@/models/Product";
import { getSpaceCountByName } from "../space/get-count-by-name";
import { tryToMoveManyIngredients } from "./move-ingedients";
import { ingredientsPreparation } from "../product/constants";
import { spaceIds } from "../product/constants";


export async function setKitchen(order: IOrder) {
    const necessary_ingredients = await whatDoINeed(order);
    const available_ingredients = await whatDoIHave();
    if ('error' in available_ingredients) {
        console.log(available_ingredients.error);
        return;
    }

    let missing_ingredients = await getMissingIngredients(necessary_ingredients, available_ingredients);
    missing_ingredients = await requestMissingIngredients(missing_ingredients, 'kitchen');
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

        'KUCHENMANZANANUEZTROZO': 0,
        'CHEESECAKEPORCION': 0,

        'QUESOLAMINADO': 0,
        'JAMONLAMINADO': 0,
        'NUTELLAPORCION': 0,
        "CROISSANT": 0,
    };

    for (const product of order.products) {
        const productData = products.find(p => p.sku === product.sku);
        if (product.sku === 'KUCHENMANZANANUEZTROZO' || product.sku ==='CHEESECAKEPORCION') {
            necessary_ingredients[`${product.sku}`] += product.quantity;
        } else {
            for (const ingredient of productData.recipe) {
                necessary_ingredients[`${ingredient.sku}`] += ingredient.req * product.quantity;
            }
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

        'KUCHENMANZANANUEZTROZO': kitchen?.['KUCHENMANZANANUEZTROZO'] || 0,
        'CHEESECAKEPORCION': kitchen?.['CHEESECAKEPORCION'] || 0,
        'QUESOLAMINADO': kitchen?.['QUESOLAMINADO'] || 0, 
        'JAMONLAMINADO': kitchen?.['JAMONLAMINADO'] || 0, 
        'NUTELLAPORCION': kitchen?.['NUTELLAPORCION'] || 0, 
        "CROISSANT": kitchen?.['CROISSANT'] || 0, 
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
    for (const { sku, base, quantity } of ingredientsPreparation) {
        if (missing_ingredients[sku]) {
            missing_ingredients[base] = Math.floor(missing_ingredients[sku] / quantity) + 1;
            delete missing_ingredients[sku];
        }
    }

    console.log('\n-----------------\nIngredientes faltantes: ', missing_ingredients, '\n')
    return missing_ingredients;
}

export async function requestMissingIngredients(missing_ingredients: Record<string, number>, destiny: keyof typeof spaceIds) {
    for (const ingredient in missing_ingredients) {
        const units = await tryToMoveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: "buffer", destiny: destiny });
        missing_ingredients[ingredient] -= units;
        if (missing_ingredients[ingredient] > 0) {
            const units = await tryToMoveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: "cold", destiny: destiny });
            missing_ingredients[ingredient] -= units;
            if (missing_ingredients[ingredient] > 0) {
                const units = await tryToMoveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: "checkIn", destiny: destiny });
                missing_ingredients[ingredient] -= units;
            }
        }
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
