'use server'

import connectDB from "@/lib/db"
import Order, {IOrder} from "@/models/Order"
import { stockUp } from "./stock-up";
import { setKitchen } from "./set-kitchen";
import { moveSugarAndSweetener } from "./move-ingedients";
import { splitMilk, grindCoffee, cook, deliver, markOrderAsDone } from "./coffee-preparacion";

export async function manageOrder(orderId: string) {
    try {
        console.log('---------------------------------------- Gestionando orden -----------------------------------------')
        await connectDB();
        let order = await Order.findById(orderId) as IOrder;
        console.log('Orden encontrada: ', order)

        // order = await checkCheckOut(order)
        if (order.products.some((product: {'sku': string, 'quantity': number}) => product.sku === 'AZUCARSACHET' || product.sku === 'ENDULZANTESACHET')) {
            await moveSugarAndSweetener(order)
        } else {
            await setKitchen(order);
            await splitMilk();
            await grindCoffee();
            await cook(order);
        }
        await deliver(order);
        markOrderAsDone(orderId);
    } catch (error) {
        console.log('Error en manageOrder: ', error)
    }
}



// async function checkCheckOut(order: IOrder) {
//     console.log('Revisando checkOut')
//     const spaces = await getSpaces();
//     for (const product of order.products) {
//         if (spaces.checkOut.skuCount[product.sku] >= product.quantity) {
//             const readyProducts = await getSpaceProducts(spaces.checkOut.id, product.sku);
//             if (readyProducts) {
//                 for (let i = 0; i < product.quantity; i++) {
//                     await deliverProduct(order._id.toString(), readyProducts[i]._id);
//                 }
//                 order.products = order.products.filter((p: {'sku': string, 'quantity': number}) => p.sku !== product.sku);
//                 if (order.products.length === 0) {
//                     markOrderAsDone(order._id.toString());
//                 }
//                 order.save();
//             } else {
//                 console.log('No ready products found in checkOut');
//             }
//         } else {
//             console.log('No hay suficientes ', product.sku, ' en checkOut');
//         }
//     }
//     return order;
// }


