'use server'

import axios from "axios"
import connectDB from "@/lib/db";
import Product, { IProduct } from "@/models/Product";

export async function getProducts() {
    try {
        await connectDB();
        const res = await axios.get(`${process.env.API_URI}/coffeeshop/products/available`);
        
        const products = res.data.map(async (productData: IProduct) => {
            try {
                const updatedProduct = await Product.findOneAndUpdate(
                    { sku: productData.sku },
                    {
                        ...productData,
                        pending: 0,
                    },
                    { upsert: true, new: true }
                );

                console.log(`Product ${updatedProduct.sku} has been saved/updated.`);
            } catch (saveError: any) {
                console.error(`Error saving/updating product ${productData.name}:`);
            }
        });


        return res.data;
    } catch (error: any) {
        //console.log(error.message);
        console.log("Error al solicitar productos");
        return null;
    }
}