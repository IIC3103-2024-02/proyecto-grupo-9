'use server'

import axios from "axios"
import { fetchToken } from "@/lib/token"

export async function getSpaces() {
    try {
        const token = await fetchToken();
        if (!token) {
            console.log('Token not found');
        }
        const res = await axios.get(`${process.env.API_URI}/spaces`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        return res.data;
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}