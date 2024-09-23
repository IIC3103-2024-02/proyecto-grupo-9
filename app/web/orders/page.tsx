
import connectDB from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import { IProduct } from "@/models/Product";


export default async function Home() {
    await connectDB();
    const orders = await Order.find({}).populate('products')

    return (
        <div>
            <h1>Orders</h1>
            <p>Aca van a estar todas las ordenes</p>
            <ul>
                {orders.map((order: IOrder) => (
                    <li key={order._id.toString()}>
                        <h2>Order {order._id}</h2>
                    </li>
                ))}
            </ul>
        </div>
    )
}

