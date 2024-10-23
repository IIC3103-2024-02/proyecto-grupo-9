'use client'

import { useState } from "react";
import { IOrder } from "@/models/Order";
import { Progress } from 'antd';

// tabla de órdenes
export default function OrdersTable({ orders }: { orders: IOrder[] }) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [stateFilter, setStateFilter] = useState<string>("");  
    const [startDateFilter, setStartDateFilter] = useState<string>("");  
    const [endDateFilter, setEndDateFilter] = useState<string>("");  
    const [clientFilter, setClientFilter] = useState<string>(""); 
    const [providerFilter, setProviderFilter] = useState<string>("");

    const toggleExpand = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const filteredOrders = orders.filter(order => {
        if (stateFilter && order.status !== stateFilter) {
            return false;
        }

        if (startDateFilter && new Date(order.createdAt) < new Date(startDateFilter)) {
            return false;
        }
        if (endDateFilter && new Date(order.createdAt) > new Date(endDateFilter)) {
            return false;
        }

        if (clientFilter && order.client !== clientFilter) {
            return false;
        }
        if (providerFilter && order.provider !== providerFilter) {
            return false;
        }

        return true;
    });

    return (
        <>
        
            {expandedOrder && (
                <tr>
                    <td colSpan={5}>
                        <OrderDetails order={orders.find((order) => order._id === expandedOrder)} />
                    </td>
                </tr>
            )}

            <div className="filter-section">
                <label>
                    Estado del Pedido:
                    <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="acepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="passed">Passed</option>
                    </select>
                </label>

                <label>
                    Fecha de Recepción - Desde:
                    <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                    />
                </label>

                <label>
                    Fecha de Recepción - Hasta:
                    <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                    />
                </label>

                <label>
                    Cliente:
                    <input
                        type="text"
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        placeholder="Buscar por cliente"
                    />
                </label>

                <label>
                    Proveedor:
                    <input
                        type="text"
                        value={providerFilter}
                        onChange={(e) => setProviderFilter(e.target.value)}
                        placeholder="Buscar por proveedor"
                    />
                </label>
            </div>
            
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

                
                </tbody>
            </table>
        </>
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
            < ProductProgressChart key={order._id} order={order} />
            <p>Estado del Pedido: {order.status}</p>
        </div>
    );
}


function ProductProgressChart({ order }:{ order?: IOrder }) {
    if (!order) return <div>Order not found</div>;
    
    const totalProductsRequested = order.quantity;
    const totalProductsMade = order.dispatched;

    const progressFraction = totalProductsMade / totalProductsRequested;
    return (
        <div style={{ marginTop: '20px' }}>
            <h5>Progreso del Producto SKU: </h5>
            
            <Progress
                type="line"
                percent={progressFraction}
                strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
                }}
                status={progressFraction < 100 ? 'active' : 'success'}
            />
        </div>
    );
}
