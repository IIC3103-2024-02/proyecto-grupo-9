'use server'

import { fetchToken } from "@/lib/coffeeshopToken"


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

export async function getSpaces() {
    try {
        const token = await fetchToken();
        if (!token) {
            console.log('Token not found');
            return [];
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
        return spaces;
    }
    catch (error: any) {
        console.log('Error al obtener los espacios');
        console.error(error.message);
        return [];
    }
}
