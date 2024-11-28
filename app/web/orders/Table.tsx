'use client'

import { useState } from "react";
import { IOrder } from "@/models/Order";
import { Progress } from 'antd';

// Tabla de órdenes con filtros y diseño adaptado
export default function OrdersTable({ orders }: { orders: IOrder[] }) {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [stateFilter, setStateFilter] = useState<string>("");  
    const [startDateFilter, setStartDateFilter] = useState<string>("");  
    const [endDateFilter, setEndDateFilter] = useState<string>("");  
    const [clientFilter, setClientFilter] = useState<string>(""); 
    const [providerFilter, setProviderFilter] = useState<string>("");

    const handleViewDetails = (order: IOrder) => {
        setSelectedOrder(order);
    };

    // Filtro de órdenes
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
        <div className="flex max-w-[1280px] mx-auto p-4 text-slate-300 h-screen">

            {/* Filtros a la izquierda */}
            <div className="w-1/4 p-4 bg-slate-800 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-slate-200 mb-4">Filtros</h2>
                <label className="block mb-4">
                    Estado del Pedido:
                    <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="block mt-1 p-2 w-full bg-slate-700 text-slate-300 rounded">
                        <option value="">Todos</option>
                        <option value="acepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="passed">Passed</option>
                    </select>
                </label>

                <label className="block mb-4">
                    Fecha de Recepción - Desde:
                    <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="block mt-1 p-2 w-full bg-slate-700 text-slate-300 rounded"
                    />
                </label>

                <label className="block mb-4">
                    Fecha de Recepción - Hasta:
                    <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="block mt-1 p-2 w-full bg-slate-700 text-slate-300 rounded"
                    />
                </label>

                <label className="block mb-4">
                    Cliente:
                    <input
                        type="text"
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        placeholder="Buscar por cliente"
                        className="block mt-1 p-2 w-full bg-slate-700 text-slate-300 rounded"
                    />
                </label>

                <label className="block mb-4">
                    Proveedor:
                    <input
                        type="text"
                        value={providerFilter}
                        onChange={(e) => setProviderFilter(e.target.value)}
                        placeholder="Buscar por proveedor"
                        className="block mt-1 p-2 w-full bg-slate-700 text-slate-300 rounded"
                    />
                </label>
            </div>

            {/* Tabla en el centro */}
            <div className="w-2/4 mx-4 flex flex-col">
                <div className="relative h-full overflow-y-auto bg-slate-800 shadow-md rounded-lg">
                    <table className="text-left table-auto min-w-[800px]">
                        <colgroup>
                            <col style={{ width: '28%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '32%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '15%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">
                                    <p className="text-sm font-normal leading-none text-slate-300">Fecha y Hora de Recepción</p>
                                </th>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">
                                    <p className="text-sm font-normal leading-none text-slate-300">ID de Pedido</p>
                                </th>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">
                                    <p className="text-sm font-normal leading-none text-slate-300">SKUs y Cantidad Solicitada</p>
                                </th>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">
                                    <p className="text-sm font-normal leading-none text-slate-300">Estado del Pedido</p>
                                </th>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">
                                    <p className="text-sm font-normal leading-none text-slate-300">Opciones</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id.toString()} className="even:bg-slate-900 hover:bg-slate-700">
                                    <td className="py-2 px-6 border-b border-slate-700">
                                        {(() => {
                                            const d = order.createdAt.toLocaleString().split(/[-T:.Z]/);
                                            return <p>{`${d[2]}/${d[1]}/${d[0]}  ${d[3]}:${d[4]}`}</p>;
                                        })()}
                                    </td>
                                    <td className="py-2 px-6 border-b border-slate-700">{`${order._id.slice(0, 4)}...${order._id.slice(-5, -1)}`}</td>
                                    <td className="py-2 px-6 border-b border-slate-700">
                                        {order.products.map((product) => (
                                            <div key={product.sku}>
                                                {product.quantity} {product.sku}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-6 border-b border-slate-700">
                                        {order.status}
                                    </td>
                                    <td className="py-2 px-6 border-b border-slate-700">
                                        <button
                                            className="text-slate-300 hover:underline"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            Ver más
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sección de detalles a la derecha */}
            <div className="w-1/4 p-4 bg-slate-800 rounded-lg shadow-md h-full">
                <h2 className="text-lg font-bold text-slate-200 mb-4">Detalle de la orden seleccionada</h2>
                {selectedOrder ? (
                    <OrderDetails order={selectedOrder} />
                ) : (
                    <p className="text-slate-400">Selecciona una orden para ver los detalles</p>
                )}
            </div>
        </div>
    );
}

// Componente para mostrar los detalles de la orden
function OrderDetails({ order }: { order: IOrder }) {
    return (
        <div className="p-4 bg-slate-900 rounded-lg shadow-md">
            <h3 className="text-lg text-slate-200">Detalles del Pedido {order._id}</h3>
            <p className="text-slate-400">Fecha de Recepción: {new Date(order.createdAt).toLocaleString()}</p>
            <p className="text-slate-400">Fecha de Entrega: {new Date(order.dueDate).toLocaleString()}</p>
            <h4 className="text-md text-slate-300 mt-2">Cliente:</h4>
            <p className="text-slate-400">{order.client}</p>
            <h4 className="text-md text-slate-300 mt-2">Proveedor:</h4>
            <p className="text-slate-400">{order.provider}</p>
            <h4 className="text-md text-slate-300 mt-2">Productos:</h4>
            <ul className="text-slate-400">
                {order.products.map((product) => (
                    <li key={product.sku}>
                        SKU: {product.sku}, Cantidad: {product.quantity}
                    </li>
                ))}
            </ul>
            <ProductProgressChart key={order._id} order={order} />
            <p className="text-slate-400">Estado del Pedido: {order.status}</p>
        </div>
    );
}

function ProductProgressChart({ order }: { order: IOrder }) {
    const totalProductsRequested = order.quantity;
    const totalProductsMade = order.dispatched;
    const progressFraction = (totalProductsMade / totalProductsRequested) * 100;

    return (
        <div className="mt-4">
            <h5 className="text-slate-300">Progreso del Producto SKU: {order.products[0].sku}</h5>
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
