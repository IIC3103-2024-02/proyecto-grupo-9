'use server'

import connectDB from "@/lib/db"
import Balance from "@/models/Balance"
import { getBankStatementAsync } from "@/lib/soap"

export const saveBalance = async () => {
    try {
        await connectDB();
        const balanceDetails = await getBankStatementAsync();
        await Balance.create({
            group: "9",
            balance: balanceDetails.balance
        });
        console.log('Balance guardado');
    } catch (error) {
        console.log('Error en saveBalance: ', error)
    }
}
