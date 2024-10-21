'use server'

import connectDB from "@/lib/db"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { requestProducts } from "../product/request-products";
import { getSpaces } from "../space/get-spaces";
import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";
import { moveMany } from "./move-many";
import { deliverProduct } from "../product/deliver-product";
import { waitForProductAvailability } from "./wait-products";

export async function makeOrder(orderId: string) {
    try {
        await connectDB();

        const order = await Order.findById(orderId);

        for (const product of order.products) {
            const spaces = await getSpaces();
            console.log('-------------------------------- \n')
            if (!spaces) {
                return {
                    error: 'No se pudieron obtener los espacios'
                };
            }
            const productData = await Product.findOne({ sku: product.sku });
            console.log('Producto a preparar: ', product.quantity +' ' +productData.name + ' ' + productData.sku)
            // check if ingredients are available in kitchen, start production and reuques more products if needed
            for (const ingredient of productData.recipe) {
                const requiredCount = ingredient.req * product.quantity;
                const ingredientCountInKitchen = spaces.kitchen.skuCount[ingredient.sku] ?? 0;
                console.log('--------------------------------')
                console.log('Ingrediente:', ingredient.sku)
                console.log('Cantidad requerida', requiredCount)
                console.log('Cantidad disponible en cocina', ingredientCountInKitchen)
                if (ingredientCountInKitchen < requiredCount) {
                    const requiredProducts = requiredCount - ingredientCountInKitchen;
                    console.log('Se requieren ', requiredProducts)
                    const ingredientData = await Product.findOne({ sku: ingredient.sku })
                    // Check if the ingredient has a recipe
                    if (ingredientData.recipe.length > 0) {
                        console.log('El ingrediente tiene receta')
                        for (const subIngredient of ingredientData.recipe) {
                            const subIngredientData = await Product.findOne({ sku: subIngredient.sku})
                            const requiredSubIngredientCount =  Math.ceil((subIngredient.req * requiredProducts) / subIngredientData.production.batch);
                            const subIngredientCountInKitchen = spaces.kitchen.skuCount[subIngredient.sku] ?? 0;
                            console.log('subIngrediente: ', subIngredientData.sku)
                            console.log('Cantidad requerida ', requiredSubIngredientCount)
                            console.log('Cantidad disponible en cocina ', subIngredientCountInKitchen)
                            
                            if (subIngredientCountInKitchen < requiredSubIngredientCount) {
                                await moveMany({ sku: subIngredient.sku, quantity: (requiredSubIngredientCount - ingredientCountInKitchen), storeId: spaces.kitchen.id });
                                console.log('Se movieron ', (requiredSubIngredientCount - ingredientCountInKitchen) + ' ' + subIngredient.sku, 'a cocina')
                            }
                            console.log('Preparando ingrediente: ', ingredient.sku);
                            const response = await requestProducts({ sku: ingredient.sku, quantity: requiredSubIngredientCount * ingredientData.production.batch }); // ajustar batch
                            if (response) {
                                await waitForProductAvailability(response);
                            } else {
                                throw new Error('No se pudo obtener la respuesta del producto');
                            }
                        }
                    } else {
                        await moveMany({ sku: ingredient.sku, quantity: requiredProducts, storeId: spaces.kitchen.id });
                        console.log('Se movieron ', requiredProducts + ' ' + ingredient.sku, 'a cocina')
                    }
                    
                } else {
                    console.log('No es necesario mover ingrediente ', ingredient.sku)
                }
            }

            //request products from kitchen and wait till ready
            const response = await requestProducts({ sku: product.sku, quantity: product.quantity });
            if (response) {
                await waitForProductAvailability(response);
            } else {
                throw new Error('No se pudo obtener la respuesta del producto');
            }
            

            // move products to checkOut
            await moveMany({ sku: product.sku, quantity: product.quantity, storeId: spaces.checkOut.id });
            console.log('Se movieron ', product.quantity + ' ' + product.sku, 'a checkOut')
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