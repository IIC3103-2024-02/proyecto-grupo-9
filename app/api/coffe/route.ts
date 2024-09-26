'use server'

import { makeOrder } from "@/actions/order/make-order";
import { manageOrder } from "@/actions/manuel/manage-order";
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { NextResponse, NextRequest } from 'next/server';
import { requestProducts } from "@/actions/product/request-products";
import { moveProduct } from "@/actions/product/move-product";
import { getSpaceProducts } from "@/actions/space/get-space-products";
import { getSpaces } from "@/actions/space/get-spaces";
import sleep from "@/actions/manuel/manage-order";


export async function POST(req: NextRequest) {
    try {
        await connectDB();


        const data = await req.json();
        console.log(data)
        const { id, order, dueDate } = data;
        const spaces = await getSpaces();
        const o = await Order.create({
            _id: id,
            products: order,
            dueDate
        });

        /* requestProducts({ sku: 'CAFEGRANO', quantity: 10}) */
        const products = await getSpaceProducts(spaces.buffer.id, 'CAFEGRANO')
        if (!products) {
            throw new Error('No hay productos en el espacio checkOut');
        }
        for (let i = 0; i < 2; i++) {
            await moveProduct(spaces.kitchen.id, products[i]._id)
        }
        requestProducts({ sku: 'CAFEMOLIDOPORCION', quantity: 40})

        const cups = await getSpaceProducts(spaces.buffer.id, 'VASOCAFEEXPRESO')
        if (!cups) {
            throw new Error('No hay productos en el espacio checkOut');
        }
        for (let i = 0; i < 40; i++) {
            await moveProduct(spaces.kitchen.id, cups[i]._id)
        }
        await sleep(130000)

        requestProducts({ sku: 'CAFEEXPRESSO', quantity: 40})
        
        await sleep(60000)
        const expresos = await getSpaceProducts(spaces.kitchen.id, 'CAFEEXPRESSO')
        if (!expresos) {
            throw new Error('No hay productos en el espacio checkOut');
        }
        for (let i = 0; i < 40; i++) {
            await moveProduct(spaces.checkOut.id, expresos[i]._id)
        }


        return NextResponse.json({
            status: 'trabajando en 40 expresos acuerdate de mantener el stock'
        }, {status: 200});
        
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, {status: 500});
    }
}