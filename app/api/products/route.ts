
import { getProducts } from "@/actions/product/get-products";

export async function GET() {
    const products = await getProducts();
    return products ? { status: 200, body: products } : { status: 500, body: { error: 'Error al solicitar productos' } };
}