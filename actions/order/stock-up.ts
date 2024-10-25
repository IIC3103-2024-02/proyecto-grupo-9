'use server';

import { getSpaces } from "../space/get-spaces";
import { requestProducts } from "../product/request-products";
import Product from "@/models/Product";

const products = [
    { sku: 'CAFEGRANO', threshold: 15, quantity: 20},
    { sku: 'LECHEENTERA', threshold: 15, quantity: 24},
    { sku: 'AZUCARSACHET', threshold: 70, quantity: 100},
    { sku: 'ENDULZANTESACHET', threshold: 70, quantity: 100},
    { sku: 'VASOCAFE', threshold: 60, quantity: 100},
    { sku: 'VASOCAFEDOBLE', threshold: 50, quantity: 80},
    { sku: 'VASOCAFEEXPRESO', threshold: 70, quantity: 120},
];

export async function stockUp() {
    console.log('Revisando stock...');
    const spaces = await getSpaces();

    if (!spaces || !spaces.checkIn || !spaces.buffer) {
        console.error('No se pudieron obtener los espacios');
        return;
    }

    for (const { sku, threshold, quantity } of products) {
    
        const pendingProduct = await Product.findOne({ sku });
        
        if (!pendingProduct) {
            console.error(`Producto con SKU ${sku} no encontrado.`);
            continue;
        }

        const totalStock = (spaces.checkIn.skuCount?.[sku] || 0) + (spaces.buffer.skuCount?.[sku] || 0);
        const pending = pendingProduct.pending;

        // console.log(`Stock total de ${sku}: ${totalStock}\tStock pendiente: ${pending}\tThreshold: ${threshold}`);
        if (totalStock < threshold && pending === 0) {
            requestProducts({ sku, quantity });
            console.log(`Solicitando ${quantity} unidades de ${sku}. (Stock actual: ${totalStock})`);
            pendingProduct.pending += quantity;
        } else if (totalStock > threshold && pending > 0) {
            pendingProduct.pending = 0;
        }

        try {
            await pendingProduct.save();
        } catch (error) {
            console.error(`Error al guardar el producto ${sku}`);
        }
    }
}

// Function to start the interval
// export async function startStockCheckInterval(intervalMinutes = 20) {
//     stockUp();
//     const intervalMs = intervalMinutes * 60 * 1000;
//     console.log(`Iniciando intervalo de verificación de stock cada ${intervalMinutes} minutos`);
//     return setInterval(stockUp, intervalMs);
// }
