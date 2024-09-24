'use server'

import connectDB from "@/lib/db"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { requestProducts } from "../product/request-products";
import { getSpaces } from "../space/get-spaces";
import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";

export async function makeOrder(orderId: string) {
    try {
        await connectDB();

        const order = await Order.findById(orderId);

        for (const product of order.products) {
            const spaces = await getSpaces();
            const productData = await Product.find({ sku: product.sku });

            // check if the product is available in kitchen, move al aviailable products to check-out
            if (spaces && spaces.kitchen && spaces.kitchen.skuCount[product.sku] > product.quantity) {
                // move to check-out area each one of the products
                // get product id, remember to order them by expire date
                const kitchenProduct = await getSpaceProducts(spaces.kitchen.id, product.sku);

                for (let i = 0; i < product.quantity; i++) {
                    await moveProduct(spaces.checkOut.id, kitchenProduct[i].id);
                }
            }
            // check if ingredients are available in kitchen, start production and reuques more products if needed
            
            // move the product from the warehouse to the kitchen
            // if error, request more products and wait for them to arrive

            // request products from the warehouse

            // when the product is available in the kitchen, move it to the check-out area

            // check quantities and request more products if needed
        }

        // deliver order

        
        return {
            status: 'Aceptado'
        };
        
    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
}