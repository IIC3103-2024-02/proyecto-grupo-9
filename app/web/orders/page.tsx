
import connectDB from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import OrdersTable from "./Table";

export const revalidate = 0;

export default async function Home() {
    await connectDB();
    
    // Ordenar ordenes por fecha
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('products');

    return (
        <div>
            <h1>Orders</h1>
            <OrdersTable orders={JSON.parse(JSON.stringify(orders))} />
        </div>
    );
}



