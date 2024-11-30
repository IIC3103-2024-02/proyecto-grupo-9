
import Order, { IOrder } from "@/models/Order";
import connectDB from "@/lib/db";
import { getSpaceProducts } from "../space/get-space-products";
import { deliverProduct } from "../product/deliver-product";
import { spaceIds } from "../product/constants";
import sleep from "./cooking";


export async function deliver(order: IOrder) {
    console.log('Entregando productos...')
    for (const product of order.products) {
        
        const readyProducts = await getSpaceProducts(spaceIds["checkOut"], product.sku);
        console.log('Productos listos: ', readyProducts?.length);
        await connectDB();
        if (readyProducts && readyProducts.length >= product.quantity) {
            for (let i = 0; i < product.quantity; i++) {
                order.dispatched += 1;
                await deliverProduct(order._id, readyProducts[i]._id);
                await sleep(500);
            }
        } else {
            console.log('Not enough ready products found in checkOut');
        }
    }
    await order.save();
}

export async function markOrderAsDone(orderId: string) {
    const order = await Order.findById(orderId);
    order.status = 'delivered';
    await order.save();
    console.log('Orden', orderId, 'marcada como entregada');
}