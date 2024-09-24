'use server'

import { getProductCount } from '@/actions/space/get-product-count';
import { getSpaces } from '@/actions/space/get-spaces';

import { NextResponse } from 'next/server';

export async function GET() {
    const spaces = await getSpaces();
    

    return NextResponse.json(spaces, { status: 200 });
}