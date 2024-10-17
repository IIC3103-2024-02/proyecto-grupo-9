'use server'

import { makeOrder } from "@/actions/order/make-order";
import { manageOrder } from "@/actions/manuel/manage-order";
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();
        const { id, order, dueDate } = data;

        

        const o = await Order.create({
            _id: id,
            products: order,
            dueDate
        });
        
        //makeOrder(order._id)
        manageOrder(o._id)

        return NextResponse.json({
            status: 'aceptado'
        }, {status: 200});
        
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
        const orders = await Order.find({}, '_id createdAt').sort({ createdAt: 1 }).exec();

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}