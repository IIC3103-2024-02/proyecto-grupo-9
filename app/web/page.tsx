'use server';

import StockAndExpirationDashboard from './orders/metrics/exp-products';
import OrdersLineChart from './orders/metrics/orders-per-hour';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import type { IOrder } from '@/models/Order';
import Dashboard from './orders/metrics/space-usege';
import { getSpaces } from '@/actions/space/get-spaces-details';

export default async function Page() {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: 1 }).exec() as IOrder[];
    const products = await Product.find({}).exec();
    const spaces = await getSpaces();
    return (
        <div className='flex flex-col items-center'>
            <Dashboard  spaces={spaces} />
            <OrdersLineChart orders={JSON.parse(JSON.stringify(orders))} />
            <StockAndExpirationDashboard products={JSON.parse(JSON.stringify(products))} spaces={spaces} />
        </div>
    );
}
