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


// export async function POST(req: NextRequest) {
//     try {
//         await connectDB();


//         const data = await req.json();
//         const { id, order, dueDate } = data;
//         const spaces = await getSpaces();

//         requestProducts({ sku: 'VASOCAFEDOBLE', quantity: 10})

//         const coffe = await getSpaceProducts(spaces.buffer.id, 'CAFEGRANO', 3)
//         if (!coffe) {
//             throw new Error('No hay productos en el espacio checkOut');
//         }
//         for (let i = 0; i < coffe.length; i++) {
//             await moveProduct(spaces.kitchen.id, coffe[i]._id)
//         }
//         await requestProducts({ sku: 'CAFEMOLIDOPORCION', quantity: 60})

//         const cups = await getSpaceProducts(spaces.buffer.id, 'VASOCAFEEXPRESO', 10)
//         if (!cups) {
//             throw new Error('No hay productos en el espacio checkOut');
//         }
//         for (let i = 0; i < cups.length; i++) {
//             await moveProduct(spaces.kitchen.id, cups[i]._id)
//         }
       
//         const milk = await getSpaceProducts(spaces.buffer.id, 'LECHEENTERA', 5)
//         if (!milk) {
//             throw new Error('No hay productos en el espacio checkOut');
//         }
//         for (let i = 0; i < milk.length; i++) {
//             await moveProduct(spaces.kitchen.id, milk[i]._id)
//         }
//         await requestProducts({ sku: 'LECHEENTERAPORCION', quantity: 60})

//         await sleep(130000)

//         await requestProducts({ sku: 'CAFEEXPRESSODOBLE', quantity: 10}) 
        
//         await sleep(1000*100)
//         const expresos = await getSpaceProducts(spaces.kitchen.id, 'CAFEEXPRESSODOBLE', 10)
//         console.log(expresos?.length)
//         if (!expresos) {
//             throw new Error('No hay productos en el espacio checkOut');
//         }
//         for (let i = 0; i < expresos.length; i++) {
//             await moveProduct(spaces.checkOut.id, expresos[i]._id)
//         }


//         return NextResponse.json({
//             status: 'trabajando en 40 expresos acuerdate de mantener el stock'
//         }, {status: 200});
        
//     } catch (error) {
//         return NextResponse.json({
//             error: (error as Error).message
//         }, {status: 500});
//     }
// }