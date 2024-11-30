'use server';
import SaldoLineChart from '@/app/web/orders/metrics/saldo-per-hour'; // Ensure this path is correct or the file exists
import StockAndExpirationDashboard from '@/app/web/orders/metrics/exp-products';
import OrdersLineChart from '@/app/web/orders/metrics/orders-per-hour';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import type { IOrder } from '@/models/Order';
import Dashboard from '@/app/web/orders/metrics/space-usege';
import { getSpacesDetails } from '@/actions/space/get-spaces-details';
import { getBalance } from '@/actions/invoice/get-balance';
import { getBankStatementAsync } from '@/lib/soap';

export default async function Page() {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: 1 }).exec() as IOrder[];
    const products = await Product.find({}).exec();
    const spaces = await getSpacesDetails();
    const statement = await getBankStatementAsync();
    const balanceactual= statement['balance'];
    const balances = await getBalance();
    return (
        <div className='flex flex-col items-center'>
            <div className="text-center mb-4"> 
                <h2 className="text-xl font-semibold">Saldo actual:</h2>
                <p className="text-3xl font-bold">{balanceactual}</p>
            </div>
            
            <Dashboard  spaces={spaces} />
            <OrdersLineChart orders={JSON.parse(JSON.stringify(orders))} />
            <SaldoLineChart balances={JSON.parse(JSON.stringify(balances))} />
            <StockAndExpirationDashboard products={JSON.parse(JSON.stringify(products))} spaces={spaces} />
        </div>
    );
}