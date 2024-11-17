
import { getBankStatementAsync, getInvoicesAsync, emitInvoiceAsync, payInvoiceAsync } from "@/lib/soap";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await getBankStatementAsync();

        /* const result = await getInvoicesAsync({
            status: 'pending',
            side: 'client',
            fromDate: '2021-11-16',
            toDate: '2021-11-17',
        }); */

        /* const result = await emitInvoiceAsync('507f191e810c19729de860ea'); */

        /* const result = await payInvoiceAsync('507f191e810c19729de860ea'); */

        return NextResponse.json({ result, status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: {
                    message: error.message || 'An unexpected error occurred',
                    name: error.name,
                    stack: error.stack,
                },
                status: 500,
            },
            { status: 500 }
        );
    }
}