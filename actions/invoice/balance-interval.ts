'use server'

import connectDB from "@/lib/db"
import Balance from "@/models/Balance"
import { getBankStatementAsync } from "@/lib/soap"

const saveBalance = async () => {
    try {
        await connectDB();
        const balanceDetails = await getBankStatementAsync();
        await Balance.create(balanceDetails);
    } catch (error) {
        console.log('Error en saveBalance: ', error)
    }
}

export const startBalanceSavingInterval = () => {
    setInterval(saveBalance, 600000); // 600,000 ms = 10 minutes
};