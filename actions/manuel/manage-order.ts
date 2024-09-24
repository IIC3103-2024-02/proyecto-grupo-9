import connectDB from "@/lib/db"
import Order, { IOrder } from "@/models/Order"
import Product from "@/models/Product"
import { getSpaces } from "../space/get-spaces";
import { moveProduct } from "../product/move-product";
import { getSpaceProducts } from "../space/get-space-products";
import { stockUp } from "./stock-up";

export async function manageOrder(orderId: string) {
    try {
        await connectDB();
        const order = await Order.findById(orderId);

        await setKitchen(order);
        splitMilk();
        grindCoffee();
        await sleep(1000*60*2+100);
    }
    catch (error) {
        console.log('Error en manageOrder: ', error)
    }
}

async function setKitchen(order: IOrder) {
    const necessary_ingredients = await whatDoINeed(order);
    const available_ingredients = await whatDoIHave();
    if ('error' in available_ingredients) {
        console.log(available_ingredients.error);
        return;
    }

    const missing_ingredients = await getMissingIngredients(necessary_ingredients, available_ingredients);
    const missing_ingredients2 = await requestIngredientsToBuffer(missing_ingredients);
    if ('error' in missing_ingredients2) {
        console.log(missing_ingredients2.error);
        return
    }
    const missing_ingredients3 = await requestIngredientsToCheckIn(missing_ingredients2);
    if ('error' in missing_ingredients3) {
        console.log(missing_ingredients3.error);
        return
    } else if (!checkKitchen(missing_ingredients3)) {
        console.log('No se pudieron mover todos los ingredientes a cocina')
        stockUp();
        return;
    }
}

async function whatDoINeed(order: IOrder) {
    const products = await Product.find();
    const necessary_ingredients: Record<string, number> = {
        'CAFEMOLIDOPORCION': 0,
        'LECHEENTERAPORCION': 0,
        'VASOCAFE': 0,
        'VASOCAFEDOBLE': 0,
        'VASOCAFEEXPRESO': 0,
    };

    for (const product of order.products) {
        const productData = products.find(p => p.sku === product.sku);
        for (const ingredient of productData.recipe) {
            necessary_ingredients[`${ingredient.sku}`] += ingredient.req * product.quantity;
        }
    }

    return necessary_ingredients;
}

async function whatDoIHave() {
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }

    const available_ingredients: Record<string, number> = {
        'CAFEMOLIDOPORCION': spaces.kitchen.skuCount['CAFEMOLIDOPORCION'] || 0,
        'LECHEENTERAPORCION': spaces.kitchen.skuCount['LECHEENTERAPORCION'] || 0,
        'VASOCAFE': spaces.kitchen.skuCount['VASOCAFE'] || 0,
        'VASOCAFEDOBLE': spaces.kitchen.skuCount['VASOCAFEDOBLE'] || 0,
        'VASOCAFEEXPRESO': spaces.kitchen.skuCount['VASOCAFEEXPRESO'] || 0,
    };

    return available_ingredients;
}

async function getMissingIngredients(necessary_ingredients: Record<string, number>, available_ingredients: Record<string, number>) {
    const missing_ingredients: Record<string, number> = {};

    for (const ingredient in necessary_ingredients) {
        if (necessary_ingredients[ingredient] > available_ingredients[ingredient]) {
            missing_ingredients[ingredient] = necessary_ingredients[ingredient] - available_ingredients[ingredient];
        }
    }
    missing_ingredients['CAFEGRANO'] = Math.floor(missing_ingredients['CAFEMOLIDOPORCION'] / 20) + 1;
    missing_ingredients['LECHEENTERA'] = Math.floor(missing_ingredients['LECHEENTERAPORCION'] / 12) + 1;
    delete missing_ingredients['CAFEMOLIDOPORCION'];
    delete missing_ingredients['LECHEENTERAPORCION'];

    return missing_ingredients;
}

async function requestIngredientsToBuffer(missing_ingredients: Record<string, number>) {
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    const buffer = spaces.buffer.id;
    const kitchen = spaces.kitchen.id;
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: buffer, destiny: kitchen });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
}

async function requestIngredientsToCheckIn(missing_ingredients: Record<string, number>) {
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    const checkIn = spaces.checkIn.id;
    const kitchen = spaces.kitchen.id;
    for (const ingredient in missing_ingredients) {
        const units = await moveManyIngredients({ sku: ingredient, quantity: missing_ingredients[ingredient], origin: checkIn, destiny: kitchen });
        missing_ingredients[ingredient] -= units;
    }
    return missing_ingredients;
}

async function moveManyIngredients({ sku, quantity, origin, destiny }: { sku: string, quantity: number, origin: string, destiny: string }) {
    try {
        const space = await getSpaceProducts(origin, sku);
        if (!space) {
            return {
                error: 'No se pudieron obtener los espacios'
            };
        }
        if (space.length >= quantity) {
            for (let i = 0; i < quantity; i++) {
                await moveProduct(destiny, space[i]._id);
                console.log('Moviendo producto ', space[i].sku);
            }
            return quantity;
        } else if (space.length === 0) {
            console.log('No hay productos en el espacio')
            return 0;
        } else {
            for (let i = 0; i < space.length; i++) {
                await moveProduct(destiny, space[i]._id);
                console.log('Moviendo producto ', space[i].sku);
            }
            return space.length;
        }
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}

function checkKitchen(missing_ingredients: Record<string, number>) {
    for (const ingredient in missing_ingredients) {
        if (missing_ingredients[ingredient] > 0) {
            return false;
        }
    }
    return true;
}

function splitMilk() {
    console.log('Separando leche')
    
}

function grindCoffee() {
    console.log('Moliendo café')
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
