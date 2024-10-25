

import { getSpaces } from '@/actions/space/get-spaces';

import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
    /* const products = await getProducts(); */
    const spaces = await getSpaces();
    
    /* monitorDirectory('/pedidos'); */

    return NextResponse.json( {spaces, status: 200 });
}