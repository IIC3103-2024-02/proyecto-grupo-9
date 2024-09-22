
import Order from "@/models/Order";
import { IProduct } from "@/models/Product";
import connectDB from "@/lib/db";

export default async function Page({params} : {params: {id: string}}) {
    await connectDB();
    const order = await Order.findById(params.id).populate('products');

    return (
        <div>
            <h1>Order {order._id}</h1>
            <ul>
                {order.products.map((product: IProduct) => (
                    <li key={product._id.toString()}>
                        <h2>{product.SKU}</h2>
                        <p>Expiration date: {product.expirationDate.toString()}</p>
                        <p>Location: {product.location}</p>
                        <p>Refrigerated: {product.refrigerated ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}