import { space } from "postcss/lib/list";
import { getSpaces } from "../space/get-spaces";

export async function stockUp() {
    const available_ingredients = await WhatDoIHave();
    
}

async function WhatDoIHave() {
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    const available_ingredients: Record<string, number> = {
        'CAFEGRANO': 0,
        'LECHEENTERA': 0,
        'ASUCARSACHET': 0,
        'ENDULZANTESACHET': 0,
        'VASOCAFE': 0,
        'VASOCAFEDOBLE': 0,
        'VASOCAFEEXPRESO': 0,
    };
    for (const space of Object.values(spaces)) {
        for (const sku in space.skuCount) {
            if (sku in available_ingredients) {
                available_ingredients[sku] += space.skuCount[sku];
            }
        }
    }
    return available_ingredients;
}
