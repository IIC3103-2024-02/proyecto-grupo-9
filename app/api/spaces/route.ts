'use server'

import { getSpaces } from "@/actions/space/get-spaces"
import { NextResponse } from "next/server";


export async function GET() {
    const spaces = getSpaces();

    return NextResponse.json(spaces, {status: 200});
}