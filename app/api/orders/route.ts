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
        const { id, products, deliveryDate } = data;

        const order = await Order.create({
            _id: id,
            products,
            deliveryDate
        });
        
        //makeOrder(order._id)
        manageOrder(order._id)

        return NextResponse.json({
            status: 'Aceptado'
        }, {status: 200});
        
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, {status: 500});
    }
}