

import { getSpacesDetails } from '@/actions/space/get-spaces-details';

import { NextResponse } from 'next/server';
import { getBankStatementAsync, getInvoicesAsync } from '@/lib/soap';

export const revalidate = 0;

export async function GET() {
    /* const products = await getProducts(); */
    /* const spaces = await getSpacesDetails(); */
    /* const bank = await getBankStatementAsync(); */
    const spaces = await getInvoicesAsync({
        status: 'pending',
        side: 'supplier',
        fromDate: '2024-11-26',
        toDate: '2024-11-28'
    })
    /* monitorDirectory('/pedidos'); */

    return NextResponse.json( {spaces, status: 200 });
}