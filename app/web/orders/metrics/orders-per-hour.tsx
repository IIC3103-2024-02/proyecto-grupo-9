'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Order {
  _id: string;
  createdAt: string; // Timestamp en UTC
}

function formatHour(dateString: string) {
  const date = new Date(dateString);
  return date.getUTCHours() + ":00"; // hora en UTC
}

function OrdersLineChart() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch('@/api/orders/route');
      const data = await response.json();
      setOrders(data);
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    // Contamos las órdenes por hora
    const ordersByHour: { [key: string]: number } = {};

    orders.forEach(order => {
      const hour = formatHour(order.createdAt);
      if (!ordersByHour[hour]) {
        ordersByHour[hour] = 0;
      }
      ordersByHour[hour]++;
    });

    const formattedData = Object.keys(ordersByHour).map(hour => ({
      name: hour,
      orders: ordersByHour[hour],
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
          <Line type="monotone" dataKey="orders" stroke="#8884d8" />
        </LineChart>
      ) : (
        <p>Cargando datos de orders...</p>
      )}
    </div>
  );
}

export default OrdersLineChart;
