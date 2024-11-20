
import { IOrder } from "@/models/Order";
import { nonRecipeProducts, productsInfo } from "../product/constants";
import { requestMissingIngredients } from "./set-kitchen";

export async function moveNonRecipeProducts(order: IOrder) {
    console.log('Moviendo productos sin receta...')
    let missing_ingredients: Record<string, number> = {};

    for (const product of order.products) {
        if (nonRecipeProducts.includes(product.sku)) {
            const productInfo = productsInfo.find(p => p.sku === product.sku);
            if (productInfo && productInfo.place !== 'checkOut') {
                missing_ingredients[product.sku] = product.quantity;
            }
        }
    }
    missing_ingredients = await requestMissingIngredients(missing_ingredients, 'checkOut');
}