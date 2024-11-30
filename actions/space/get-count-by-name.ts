'use server'

import { spaceIds } from "../product/constants";
import { getProductCount } from "./get-product-count";

export async function getSpaceCountByName(name: keyof typeof spaceIds) {
    try {
        const spaceId = spaceIds[name];
        if (!spaceId) {
            console.log('Space not found');
            return null;
        }
        const productCounts = await getProductCount(spaceId);
        const skuCount: { [sku: string]: number } = {};
        productCounts?.forEach((product: { sku: string ; quantity: number; }) => {
            skuCount[product.sku] = product.quantity;
        });
        return skuCount;

    } catch (error: any) {
        console.log('Error al obtener el conteo de productos por nombre');
        console.error(error);
        return null;
    }
}
