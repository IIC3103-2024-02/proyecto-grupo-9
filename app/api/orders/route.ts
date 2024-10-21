'use server'

import { makeOrder } from "@/actions/order-malo/make-order";
import { manageOrder } from "@/actions/order/manage-order";
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { NextResponse, NextRequest } from 'next/server';
import { getOrder } from "@/actions/purchaseOrder/get-order";
import { updateOrder } from "@/actions/purchaseOrder/update-order";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();
        const { id } = data;

<<<<<<< HEAD
=======
        const order = await getOrder({ orderId: id });
        
        if (!order) {
            return NextResponse.json({
                error: 'Orden no encontrada'
            }, { status: 404 });
        }

>>>>>>> feat/buy-orders
        const o = await Order.create({
            _id: id,
            products: {
                sku: order.sku,
                quantity: order.cantidad
            },
            quantity: order.cantidad,
            dispatched: order.despachado,
            client: order.cliente,
            provider: order.proveedor,
            status: 'pending',
            dueDate: order.vencimiento
        });

        if (false) {
            // Si la orden no se puede procesar
            await updateOrder({ orderId: id, status: 'rechazada' });
            o.status = 'rejected';
            await o.save();
            
            return NextResponse.json({
                status: 'rechazado'
            }, { status: 200 });
        } else {
            // Si la orden se puede procesar
            manageOrder(o._id)
            await updateOrder({ orderId: id, status: 'aceptada' });
            o.status = 'acepted';
            await o.save();

            return NextResponse.json({
                status: 'aceptado'
            }, {status: 200});
        }
        
        
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        //órdenes con campos _id y createdAt
        const orders = await Order.find({}).sort({ createdAt: 1 }).exec();

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}