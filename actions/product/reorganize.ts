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

        if (prodInCheckIn > 0 && place !== 'checkIn') {
            await moveManyIngredients({ sku, quantity: prodInCheckIn, origin: 'checkIn', destiny: place });
        }
        if (prodInBuffer > 0) {
            await moveManyIngredients({ sku, quantity: prodInBuffer, origin: 'buffer', destiny: place });
        }
    }
}
