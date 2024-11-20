
import Order, { IOrder } from "@/models/Order";
import connectDB from "@/lib/db";
import { getSpaceProducts } from "../space/get-space-products";
import { deliverProduct } from "../product/deliver-product";
import { spaceIds } from "../product/constants";


export async function deliver(order: IOrder) {
    console.log('Entregando productos...')
    for (const product of order.products) {
        
        const readyProducts = await getSpaceProducts(spaceIds["checkOut"], product.sku);
        if (readyProducts && readyProducts.length >= product.quantity) {
            for (let i = 0; i < product.quantity; i++) {
                await connectDB();
                order.dispatched += 1;
                await deliverProduct(order._id, readyProducts[i]._id);
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