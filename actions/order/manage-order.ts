'use server'

import connectDB from "@/lib/db"
import Order, {IOrder} from "@/models/Order"
import { nonRecipeProducts, recipeProducts } from "../product/constants";
import { setKitchen } from "./set-kitchen";
import { prepareIngredients, cook } from "./cooking";
import { deliver, markOrderAsDone } from "./deliver";
import { stockUp } from "../product/stock-up";
import { reOrganize } from "../product/reorganize";
import { moveNonRecipeProducts } from "./move-non-recipe";

export async function manageOrder(orderId: string) {
    try {
        console.log('---------------------------------------- Gestionando orden -----------------------------------------')
        await connectDB();
        let order = await Order.findById(orderId) as IOrder;
        console.log('Orden encontrada: ', order)

        if (order.products.some((product: {'sku': string, 'quantity': number}) => nonRecipeProducts.includes(product.sku))) {
            moveNonRecipeProducts(order);
        }

        if (order.products.some((product: {'sku': string, 'quantity': number}) => recipeProducts.includes(product.sku))) {
            await setKitchen(order);
            await prepareIngredients();
            await cook(order);
        }
        await deliver(order);
        markOrderAsDone(orderId);
        stockUp();
        reOrganize();

    } catch (error) {
        console.log('Error en manageOrder: ', error)
    }
}




