

import { fetchToken } from "@/lib/coffeeshopToken"
import { getProductCount } from "./get-product-count"

export interface Space {
    _id: string;
    cold: boolean;
    buffer: boolean;
    checkIn: boolean;
    checkOut: boolean;
    kitchen: boolean;
    totalSpace: number;
    usedSpace: number;
}

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

export const revalidate = 0;

export async function getSpaces() {
    try {
        const token = await fetchToken();
        if (!token) {
            console.log('Token not found');
            return {};
        }

        const res = await fetch(`${process.env.API_URI}/coffeeshop/spaces`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const spaces = await res.json() as unknown as Space[];
        const data: SpaceDictionary = {};

        for (const space of spaces) {
            // Find the first key with a value of true
            const key = Object.keys(space).find(k => space[k as keyof Space] === true) as keyof Space;
            // If a valid key is found, populate the dictionary
            if (key) {
                const productCounts = await getProductCount(space._id);
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
        return {}; // Return an empty object in case of error
    }
}


