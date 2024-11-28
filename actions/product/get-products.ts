'use server'

import axios from "axios"
import connectDB from "@/lib/db";
import Product, { IProduct } from "@/models/Product";

export async function getProducts() {
    try {
        await connectDB();
        const res = await axios.get(`${process.env.API_URI}/coffeeshop/products/available`);
        const updates: Record<string, any> = {};
        await Promise.all(
            res.data.map(async (productData: IProduct) => {
                try {
                    const updatedProduct = await Product.findOneAndUpdate(
                        { sku: productData.sku },
                        {
                            $set: productData,
                            $setOnInsert: { pending: 0 },
                        },
                        { upsert: true, new: true }
                    );

                    console.log(`Product ${updatedProduct.sku} has been saved/updated.`);
                    updates[updatedProduct.sku] = updatedProduct;
                } catch (saveError: any) {
                    console.error(`Error saving/updating product ${productData.sku}:`, saveError.message);
                }
            })
        );

        return updates;
    } catch (error: any) {
        console.error("Error al actualizar productos:", error.response?.data || error.message);
        return null;
    }
}