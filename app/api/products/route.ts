
import { getProducts } from "@/actions/product/get-products";
import { NextResponse } from "next/server";

export async function GET() {
    const products = await getProducts();
    return NextResponse.json( {products, status: 200 });
}