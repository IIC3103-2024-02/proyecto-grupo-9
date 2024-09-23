'use server'
import { getProducts } from "@/actions/product/get-products"

export default async function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>Aca van a estar las estadisticas y metricas de cada espacio</p>
        </div>
    )
}