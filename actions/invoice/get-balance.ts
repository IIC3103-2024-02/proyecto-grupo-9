'use server'

import connectDB from "@/lib/db"
import Balance, { IBalance } from "@/models/Balance"

export async function getBalance() {
    try {
        await connectDB();
        const balances = await Balance.find({}).sort({ createdAt: 1 }).exec();

        return balances as IBalance[];
    } catch (error) {
        console.log('Error en getBalance: ', error)
    }
}