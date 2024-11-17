'use server'

import { getProductCount } from "./get-product-count"
import { getSpaces, Space } from "./get-spaces";


export interface SpaceDictionary {
    [key: string]: SpaceData;
}

export interface SpaceData {
    id: string;
    name: string;
    totalSpace: number;
    usedSpace: number;
    skuCount: { [skuName: string]: number };
}

export async function getSpacesDetails() {
    try {
        const spaces = await getSpaces();
        const data: SpaceDictionary = {};

        for (const space of spaces) {
            const key = Object.keys(space).find(k => space[k as keyof Space] === true) as keyof Space;
            if (key) {
                const productCounts = (await getProductCount(space._id)) || [];
                const skuCount: { [sku: string]: number } = {};
                productCounts.forEach((product: { sku: string ; quantity: number; }) => {
                    skuCount[product.sku] = product.quantity;
                });

                data[key] = {
                    id: space._id,
                    name: key,
                    totalSpace: space.totalSpace,
                    usedSpace: space.usedSpace,
                    skuCount: skuCount
                };
            }
        };

        return data;
    } catch (error: any) {
        console.log('Error al obtener los espacios');
        console.error(error);
        return {};
    }
}


