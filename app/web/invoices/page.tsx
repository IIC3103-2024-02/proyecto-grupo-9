'use server';

import { InvoicesTable } from "./invoices-table";

export default async function Page() {

    return (
        <div>
            <InvoicesTable />
        </div>
    );
}