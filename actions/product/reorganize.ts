'use server'

import { getSpacesDetails } from "../space/get-spaces-details";
import { moveManyIngredients } from "../order/move-ingedients";
import { productsInfo } from "../product/constants";


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
        const placeSpace = totalSpace(spaces[place].skuCount);

        if (prodInCheckIn > 0 && place !== 'checkIn') {
            const q = spaces[place].totalSpace - (placeSpace + prodInCheckIn);
            if (q > 0) {
                await moveManyIngredients({ sku, quantity: prodInCheckIn, origin: 'checkIn', destiny: place });
            } else {
                await moveManyIngredients({ sku, quantity: q, origin: 'checkIn', destiny: place });
            }
        }
        if (prodInBuffer > 0 && placeSpace + prodInBuffer < spaces[place].totalSpace) {
            const q = spaces[place].totalSpace - (placeSpace + prodInBuffer);
            if (q > 0) {
                await moveManyIngredients({ sku, quantity: prodInBuffer, origin: 'buffer', destiny: place });
            } else {
                await moveManyIngredients({ sku, quantity: q, origin: 'buffer', destiny: place });
            }
        }
    }
}

function totalSpace(space: Record<string, number>) {
    return Object.values(space).reduce((acc, val) => acc + val, 0);
}
