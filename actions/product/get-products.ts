'use server'

import axios from "axios"

export async function getProducts() {
    try {
        const res = await axios.get(`${process.env.API_URI}/products/avialable`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_TOKEN}`
                }
            }
        );
        
        return res.data;
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}