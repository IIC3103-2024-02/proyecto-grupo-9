'use server'

import { space } from "postcss/lib/list";
import { getSpaces } from "../space/get-spaces";
import Order from "@/models/Order";
import { requestProducts } from "../product/request-products";

export async function stockUp() {
    console.log('Revisando stock');
    const orders = await Order.find();
    const n_order = orders.length;
    CheckCoffee(n_order);
    CheckMilk(n_order);
    CheckSugar(n_order);
    CheckSweetener(n_order);
    CheckCoffeeCup(n_order);
    CheckDoubleCoffeeCup(n_order);
    CheckExpressoCup(n_order);
}

async function CheckCoffee(order: number) {
    if (order % 4 === 0) {
        requestProducts({ sku: 'CAFEGRANO', quantity: 20 });
    }
}

async function CheckMilk(order: number) {
    if (order % 3 === 0) {
        requestProducts({ sku: 'LECHEENTERA', quantity: 12 });
    }
}

async function CheckSugar(order: number) {
    if (order % 8 === 0) {
        requestProducts({ sku: 'ASUCARSACHET', quantity: 100 });
    }
}

async function CheckSweetener(order: number) {
    if (order % 8 === 0) {
        requestProducts({ sku: 'ENDULZANTESACHET', quantity: 100 });
    }
}

async function CheckCoffeeCup(order: number) {
    if (order % 15 === 0) {
        requestProducts({ sku: 'VASOCAFE', quantity: 100 });
    }
}

async function CheckDoubleCoffeeCup(order: number) {
    if (order % 20 === 0) {
        requestProducts({ sku: 'VASOCAFEDOBLE', quantity: 80 });
    }
}

async function CheckExpressoCup(order: number) {
    if (order % 15 === 0) {
        requestProducts({ sku: 'VASOCAFEEXPRESO', quantity: 120 });
    }
}



//     const available_ingredients = await WhatDoIHave();
//     if ('error' in available_ingredients) {
//         console.log(available_ingredients.error);
//         return;
//     }
//     await setOrder(available_ingredients);
// }

// async function WhatDoIHave() {
//     const spaces = await getSpaces();
//     if (!spaces) {
//         return {
//             error: 'No se pudieron obtener los espacios'
//         };
//     }
//     const available_ingredients: Record<string, number> = {
//         'CAFEGRANO': 0,
//         'LECHEENTERA': 0,
//         'ASUCARSACHET': 0,
//         'ENDULZANTESACHET': 0,
//         'VASOCAFE': 0,
//         'VASOCAFEDOBLE': 0,
//         'VASOCAFEEXPRESO': 0,
//     };
//     for (const space of Object.values(spaces)) {
//         for (const sku in space.skuCount) {
//             if (sku in available_ingredients) {
//                 available_ingredients[sku] += space.skuCount[sku];
//             }
//         }
//     }
//     return available_ingredients;
// }

// async function setOrder(available_ingredients: Record<string, number>) {
//     const necessary_ingredients: Record<string, number> = {
//         'CAFEGRANO': 10,
//         'LECHEENTERA': 12,
//         'ASUCARSACHET': 10,
//         'ENDULZANTESACHET': 10,
//         'VASOCAFE': 10,
//         'VASOCAFEDOBLE': 10,
//         'VASOCAFEEXPRESO': 10,
//     };
//     const missing_ingredients = getMissingIngredients(necessary_ingredients, available_ingredients);
//     if (Object.keys(missing_ingredients).length > 0) {
//         console.log('Faltan ingredientes, solicitando a buffer');
        
//     }
// }
