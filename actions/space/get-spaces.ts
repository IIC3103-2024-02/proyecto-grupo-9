'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"
import { getProductCount } from "./get-product-count"

interface Space {
    _id: string;
    cold: boolean;
    buffer: boolean;
    checkIn: boolean;
    checkOut: boolean;
    kitchen: boolean;
    totalSpace: number;
    usedSpace: number;
}

interface SpaceDictionary {
    [key: string]: SpaceData;
}

export interface SpaceData {
    id: string;
    name: string;
    totalSpace: number;
    usedSpace: number;
    skuCount: { [skuName: string]: number };
}

export async function getSpaces() {
    try {
        const token = await fetchToken();
        if (!token) {
            console.log('Token not found');
            return {}; // Return an empty object if token is not found
        }
        const res = await axios.get(`${process.env.API_URI}/spaces`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-store'
            }
        });
        const spaces = res.data as Space[];
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
        return {}; // Return an empty object in case of error
    }
}