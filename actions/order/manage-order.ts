'use server'

import connectDB from "@/lib/db"
import Order, {IOrder} from "@/models/Order"
import { setKitchen } from "./set-kitchen";
// import { moveSugarAndSweetener } from "./move-ingedients";
import { splitMilk, grindCoffee, cook, deliver, markOrderAsDone } from "./coffee-preparacion";
import { stockUp } from "../product/stock-up";
import { reOrganize } from "../product/reorganize";
import { createInvoice } from "../invoice/create-invoice";

export async function manageOrder(orderId: string) {
    try {
        console.log('---------------------------------------- Gestionando orden -----------------------------------------')
        await connectDB();
        let order = await Order.findById(orderId) as IOrder;
        console.log('Orden encontrada: ', order)

        // order = await checkCheckOut(order)
        // if (order.products.some((product: {'sku': string, 'quantity': number}) => product.sku === 'AZUCARSACHET' || product.sku === 'ENDULZANTESACHET')) {
        //     await moveSugarAndSweetener(order)
        // }
        if (order.products.some((product: {'sku': string, 'quantity': number}) => product.sku === 'CAFEEXPRESSO' || product.sku === 'CAFEEXPRESSODOBLE' || product.sku === 'CAFELATTE' || product.sku === 'CAFELATTEDOBLE')) {
            await setKitchen(order);
            await splitMilk();
            await grindCoffee();
            await cook(order);
        }
        await deliver(order);
        markOrderAsDone(orderId);
        createInvoice(orderId);
        stockUp();
        reOrganize();

    } catch (error) {
        console.log('Error en manageOrder: ', error)
    }
}




