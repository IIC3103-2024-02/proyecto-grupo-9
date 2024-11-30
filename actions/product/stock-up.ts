'use server';

import { getSpacesDetails } from "../space/get-spaces-details";
import { requestProducts } from "./request-products";
import Product, { IProduct } from "@/models/Product";
import { productsInfo } from "./constants";
import { requestProductToAnotherGroup } from "./request-product-group";
import connectDB from "@/lib/db";


export async function stockUp() {
    console.log('Revisando stock...');
    const spaces = await getSpacesDetails();

    if (!spaces || !spaces.checkIn || !spaces.buffer) {
        console.error('No se pudieron obtener los espacios');
        return;
    }

    for (const { sku, threshold, quantity, distributor } of productsInfo) {
    
        const pendingProduct = await Product.findOne({ sku }) as IProduct;
        if (!pendingProduct) {
            console.error(`Producto con SKU ${sku} no encontrado.`);
            continue;
        }

        const totalStock = (spaces.checkIn.skuCount?.[sku] || 0) + (spaces.buffer.skuCount?.[sku] || 0) 
            + (spaces.cold.skuCount?.[sku] || 0 ) + (spaces.checkOut.skuCount?.[sku] || 0);
        const pending = pendingProduct.pending;

        /* console.log(`Stock total de ${sku}: ${totalStock}\tStock pendiente: ${pending}\tThreshold: ${threshold}`); */
        if (pending + totalStock <= threshold) {
            if (distributor) {
                requestProducts({ sku, quantity });
                console.log(`Solicitando ${quantity} unidades de ${sku}. (Stock actual: ${totalStock})`);
                pendingProduct.pending += quantity;
            } else {
                const randomIndex = Math.floor(Math.random() * pendingProduct.production.groups.length);
                const group = pendingProduct.production.groups[randomIndex];
                requestProductToAnotherGroup(group, sku, quantity);
                console.log(`Solicitando ${quantity} unidades de ${sku} al grupo ${group}. (Stock actual: ${totalStock})`);
                pendingProduct.pending = 1;
            }
        } else if (totalStock > threshold && pending > 0) {
            pendingProduct.pending = 0;
        }
        try {
            await connectDB();
            await pendingProduct.save();
        } catch (error) {
            console.error(`Error al guardar el producto ${sku}`);
        }
    }
}



