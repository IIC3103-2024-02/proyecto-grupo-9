'use client'

import { useState } from "react";
import { IOrder } from "@/models/Order";

// tabla de órdenes
export default function OrdersTable({ orders }: { orders: IOrder[] }) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const toggleExpand = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <table className="w-screen text-center">
            <thead>
                <tr>
                    <th>Fecha y Hora de Recepción</th>
                    <th>ID de Pedido</th>
                    <th>SKUs y Cantidad Solicitada</th>
                    <th>Estado del Pedido</th>
                    <th>Opciones</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order._id.toString()}>
                        <td>{order.createdAt.toLocaleString()}</td>
                        <td>{order._id}</td>
                        <td>
                            {order.products.map((product) => (
                                <div key={product.sku}>
                                    SKU: {product.sku}, Cantidad: {product.quantity}
                                </div>
                            ))}
                        </td>
                        <td>
                            <button onClick={() => toggleExpand(order._id)}>
                                {expandedOrder === order._id ? "Ocultar" : "Ver más"}
                            </button>
                        </td>
                    </tr>
                ))}

                {expandedOrder && (
                    <tr>
                        <td colSpan={5}>
                            <OrderDetails order={orders.find((order) => order._id === expandedOrder)} />
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

function OrderDetails({ order }: { order?: IOrder }) {
    if (!order) return null;

    return (
        <div>
            <h3>Detalles del Pedido {order._id}</h3>
            <p>Fecha de Recepción: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Fecha de Entrega: {new Date(order.dueDate).toLocaleString()}</p>
            <h4>Productos:</h4>
            <ul>
                {order.products.map((product) => (
                    <li key={product.sku}>
                        SKU: {product.sku}, Cantidad: {product.quantity}
                    </li>
                ))}
            </ul>
            <p>Estado del Pedido: {order.status}</p>
        </div>
    );
}