'use server'

import { IOrder } from "@/models/Order";
import Product from "@/models/Product";
import { ingredientsPreparation } from "../product/constants";
import { getSpacesDetails } from "../space/get-spaces-details";


export async function acceptOrder(order: IOrder) {
    const necessary_ingredients = await whatDoINeed(order);
    const available_ingredients = await whatDoIHave();
    if ('error' in available_ingredients) {
        console.log(available_ingredients.error);
        return false;
    }

    return await getMissingIngredients(necessary_ingredients, available_ingredients);
}

async function whatDoINeed(order: IOrder) {
    const products = await Product.find();
    const necessary_ingredients: Record<string, number> = {}

    for (const product of order.products) {
        const productData = products.find(p => p.sku === product.sku);
        if (product.sku === 'KUCHENMANZANANUEZTROZO' || product.sku ==='CHEESECAKEPORCION') {
            necessary_ingredients[`${product.sku}`] = (necessary_ingredients[product.sku] || 0) + product.quantity;
        } else if (productData.recipe.length === 0) {
            necessary_ingredients[`${product.sku}`] = (necessary_ingredients[product.sku] || 0) + product.quantity;
        } else {
            for (const ingredient of productData.recipe) {
                necessary_ingredients[`${ingredient.sku}`] = (necessary_ingredients[product.sku] || 0) + ingredient.req * product.quantity;
            }
        }
    }
    console.log('\n----------------\nIngredientes necesarios:', necessary_ingredients, '\n')
    return necessary_ingredients;
}

async function whatDoIHave() {
    const available_ingredients: Record<string, number> = {};
    const spaces = await getSpacesDetails();
    for (const space in spaces) {
        for (const sku in spaces[space].skuCount) {
            available_ingredients[sku] = (available_ingredients[sku] || 0) + spaces[space].skuCount[sku];
        }
    }
    for (const { sku, base, quantity } of ingredientsPreparation) {
        if (available_ingredients[base]){
            available_ingredients[sku] = (available_ingredients[sku] || 0) + available_ingredients[base] * quantity; 
        }
    }

    console.log('\n-----------------\nIngredientes disponibles: ', available_ingredients, '\n')
    return available_ingredients;
}


async function getMissingIngredients(necessary_ingredients: Record<string, number>, available_ingredients: Record<string, number>) {
    for (const ingredient in necessary_ingredients) {
        if (necessary_ingredients[ingredient] > (available_ingredients[ingredient] || 0)) {
            console.log(`Lo siento. No nos queda ${ingredient} :(`);
            return false;
        }
    }
    return true;
}