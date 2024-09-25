'use server'

import axios from "axios"
import connectDB from "@/lib/db";
import Product, { IProduct } from "@/models/Product";

export async function getProducts() {
    try {
        await connectDB();
        const res = await axios.get(`${process.env.API_URI}/products/available`);
        
        const products = res.data.map(async (productData: IProduct) => {
            const product = new Product(productData);
            // Save the product to the database
            try {
                await product.save();
                console.log(`Product saved: ${product.name}`);
            } catch (saveError: any) {
                console.error(`Error saving product ${product.name}:`, saveError.message);
            }
        });

        return res.data;
    } catch (error: any) {
        //console.log(error.message);
        console.log("Error al solicitar productos");
        return null;
    }
}