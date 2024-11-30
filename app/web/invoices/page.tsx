'use server';

import { Suspense } from "react";
import { InvoicesTable } from "./invoices-table";
import { getInvoicesAsync } from "@/lib/soap";

export default async function Page(props:
    {
        searchParams?: {
            status?: "pending" | "paid";
            side?: "supplier" | "client";
            fromDate?: string;
            toDate?: string;
        }
    }
) {
    const { searchParams } = props;
    console.log('searchParams', searchParams);
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const side = searchParams?.side || 'client';
    const status = searchParams?.status || 'pending';
    const fromDate = searchParams?.fromDate || formatDate(threeDaysAgo);
    const toDate = searchParams?.toDate || formatDate(today);

    const invoices = await getInvoicesAsync({
        status: status,
        side: side,
        fromDate: fromDate,
        toDate: toDate,
    });

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>} >
                <InvoicesTable invoices={invoices} />
            </Suspense>
        </div>
    );
}

const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Extract only the date part in 'yyyy-mm-dd' format
};