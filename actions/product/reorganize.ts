'use server'

import { getSpacesDetails } from "../space/get-spaces-details";
import { moveManyIngredients } from "../order/move-ingedients";
import { productsInfo, ingredientsPreparation } from "../product/constants";


export async function reOrganize() {
    console.log('Reorganizando stock...');
    const spaces = await getSpacesDetails();

    if (!spaces || !spaces.checkIn || !spaces.buffer) {
        console.error('No se pudieron obtener los espacios');
        return;
    }
    
    for (const { sku, place } of productsInfo) {
        const prodInBuffer = spaces.buffer.skuCount?.[sku] || 0;
        const prodInCheckIn = spaces.checkIn.skuCount?.[sku] || 0;
        const placeSpace = spaces[place].totalSpace - spaces[place].usedSpace;

        if (prodInCheckIn > 0 && place !== 'checkIn') {
            if (placeSpace > prodInCheckIn) {
                await moveManyIngredients({ sku, quantity: prodInCheckIn, origin: 'checkIn', destiny: place });
            } else {
                await moveManyIngredients({ sku, quantity: placeSpace, origin: 'checkIn', destiny: place });
            }
        }
        if (prodInBuffer > 0) {
            if (placeSpace - prodInCheckIn > prodInBuffer) {
                await moveManyIngredients({ sku, quantity: prodInBuffer, origin: 'buffer', destiny: place });
            } else {
                await moveManyIngredients({ sku, quantity: placeSpace-prodInCheckIn, origin: 'buffer', destiny: place });
            }
        }
    }
    for (const {sku} of ingredientsPreparation) {
        const prodInBuffer = spaces.buffer.skuCount?.[sku] || 0;
        const prodInCheckIn = spaces.checkIn.skuCount?.[sku] || 0;
        const kitchenSpace = spaces.kitchen.totalSpace - spaces.kitchen.usedSpace;

        if (prodInCheckIn > 0 && kitchenSpace > prodInCheckIn) {
            await moveManyIngredients({ sku, quantity: prodInCheckIn, origin: 'checkIn', destiny: 'kitchen' });
        } else if (prodInCheckIn > 0) {
            await moveManyIngredients({ sku, quantity: kitchenSpace, origin: 'checkIn', destiny: 'kitchen' });
        }
        if (prodInBuffer > 0) {
            if (kitchenSpace - prodInCheckIn > prodInBuffer) {
                await moveManyIngredients({ sku, quantity: prodInBuffer, origin: 'buffer', destiny: 'kitchen' });
            } else {
                await moveManyIngredients({ sku, quantity: kitchenSpace-prodInCheckIn, origin: 'buffer', destiny: 'kitchen' });
            }
        }
    }
}

