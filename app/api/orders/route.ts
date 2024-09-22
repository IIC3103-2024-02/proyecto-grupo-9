'use server'

import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await connectDB();


        const data = req.json();
        console.log(data);

        /* await Order.create(data); */

        return NextResponse.json({
            status: 'Aceptado'
        }, {status: 200});
        
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, {status: 500});
    }
}