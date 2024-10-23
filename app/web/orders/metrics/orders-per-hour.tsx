'use client';

import Order from '@/models/Order';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IOrder } from '@/models/Order';



function formatHour(dateString: string) {
    const date = new Date(dateString);
    return date.getUTCHours() + ":00"; // hora en UTC
}

interface OrdersLineChartProps {
    orders: IOrder[];
}

function OrdersLineChart({ orders: o }: OrdersLineChartProps) {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (o.length > 0) {
            setOrders(o);
        }
    }, [o]);
    useEffect(() => {
    // Contamos las órdenes por hora

        const ordersByHour: { [key: string]:  { delivered: number, rejected: number, accepted: number, passed: number } } = {};

        orders.forEach(order => {
            const hour = formatHour(order.createdAt.toString());
            if (!ordersByHour[hour]) {
                ordersByHour[hour] = { delivered: 0, rejected: 0, accepted: 0, passed:0 };
            }
            if (order.status === "delivered") {
                ordersByHour[hour].delivered++;
            } else if (order.status === "rejected") {
                ordersByHour[hour].rejected++;
            } else if (order.status === "acepted") {
                ordersByHour[hour].accepted++;
            } else if (order.status === "passed") {
                ordersByHour[hour].passed++;
            }
        });

        const formattedData = Object.keys(ordersByHour).map(hour => ({
            name: hour,
            delivered: ordersByHour[hour].delivered,
            rejected: ordersByHour[hour].rejected,
            accepted: ordersByHour[hour].accepted,
            vencidas: ordersByHour[hour].passed,
        }));

        setChartData(formattedData);
    }, [orders]);

    return (
        <div>
            <h2>Órdenes recibidas por hora</h2>
            {chartData.length > 0 ? (
                <LineChart
                    width={730}
                    height={250}
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Hora (UTC)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Número de Órdenes', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="delivered" stroke="#8884d8" name="Delivered Orders" />
                    <Line type="monotone" dataKey="rejected" stroke="#82ca9d" name="Rejected Orders" />
                    <Line type="monotone" dataKey="accepted" stroke="#ffc658" name="Accepted Orders" />
                    <Line type="monotone" dataKey="passed" stroke="#ff7300" name="Passed Orders" />
                </LineChart>
            ) : (
                <p>Cargando datos de orders...</p>
            )}
        </div>
    );
}

export default OrdersLineChart;
