'use server'

import { getProducts } from '@/actions/product/get-products';
import { getProductCount } from '@/actions/space/get-product-count';
import { getSpaces } from '@/actions/space/get-spaces';

import { NextResponse } from 'next/server';

export async function GET() {
    const products = await getProducts();
    const spaces = await getSpaces();
    

    return NextResponse.json(spaces, { status: 200 });
}