'use server'

import connectDB from "@/lib/db"
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        
        return NextResponse.json({
            db: 'OK',
            server: 'OK'
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, {status: 500});
    }
}