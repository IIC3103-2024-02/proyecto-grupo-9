
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
                        <ul>
                            {order.products.map((product: IProduct) => (
                                <li key={product._id.toString()}>
                                    <h3>{product.sku}</h3>
                                    <p>Expiration date: {product.expirationDate.toString()}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}

