'use server';

import { getSpaces } from "../space/get-spaces";
import { requestProducts } from "../product/request-products";

const products = [
    { sku: 'CAFEGRANO', threshold: 10, quantity: 30 },
    { sku: 'LECHEENTERA', threshold: 12, quantity: 24 },
    { sku: 'AZUCARSACHET', threshold: 30, quantity: 100 },
    { sku: 'ENDULZANTESACHET', threshold: 30, quantity: 100 },
    { sku: 'VASOCAFE', threshold: 30, quantity: 100 },
    { sku: 'VASOCAFEDOBLE', threshold: 30, quantity: 80 },
    { sku: 'VASOCAFEEXPRESO', threshold: 30, quantity: 120 },
];

async function stockUp() {
    console.log('Revisando stock...');
    const spaces = await getSpaces();

    if (!spaces || !spaces.checkIn || !spaces.buffer) {
        console.error('No se pudieron obtener los espacios');
        return;
    }

    products.forEach(({ sku, threshold, quantity }) => {
        const totalStock =
            (spaces.checkIn.skuCount?.[sku] || 0) + (spaces.buffer.skuCount?.[sku] || 0);

        if (totalStock < threshold) {
            requestProducts({ sku, quantity });
        }
    });
}

// Function to start the interval
export function startStockCheckInterval(intervalMinutes = 30) {
    stockUp();
    const intervalMs = intervalMinutes * 60 * 1000;
    console.log(`Iniciando intervalo de verificación de stock cada ${intervalMinutes} minutos`);
    return setInterval(stockUp, intervalMs);
}
