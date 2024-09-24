// devolver truo o false si todos los elementos estan en la cocina 
'use server'

import connectDB from "@/lib/db"
import Product, { IProduct } from "@/models/Product"
import { getProductCount } from "../space/get-product-count";
import { getSpaceProducts } from "../space/get-space-products";
import { getSpaces } from "../space/get-spaces";

export async function checkSku(sku: string) {
    try {
        await connectDB();
        const productData = await Product.findOne({ sku: sku });
        const spaces = await getSpaces();

        if (!spaces) {
            throw new Error("Spaces not found");
        }
        
        if (!productData) {
            throw new Error("Product not found");
        }
        const product: IProduct = productData.toObject() as IProduct;

        const skuCount: { [key: string]: number } = {}

        for (const ingredient of product.recipe) {
            const products = await getSpaceProducts(spaces.kitchen.id, ingredient.sku);
            const productCount = products.length;

            skuCount[ingredient.sku] = productCount;
        }

        return skuCount;

    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}
