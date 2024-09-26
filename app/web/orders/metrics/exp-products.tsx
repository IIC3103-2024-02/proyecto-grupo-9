'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Label } from 'recharts';
import { getProducts } from '@/actions/product/get-products';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getSpaceProducts } from '@/actions/space/get-space-products';
import { getSpaces } from '@/actions/space/get-spaces';
import { IProduct } from '@/models/Product';
import { SpaceDictionary } from '@/actions/space/get-spaces';


interface ProductCount {
  sku: string;
  name: string;
  totalStock: number; 
  expiringSoon: number; 
}

interface StockAndExpirationDashboardProps {
  products: IProduct[];
  spaces: SpaceDictionary;
}

export default function StockAndExpirationDashboard({ products, spaces }: StockAndExpirationDashboardProps) {
    const [productCounts, setProductCounts] = useState<ProductCount[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            const productData = products;
            const currentTime = new Date();

            // Definir un rango de 3 horas
            const threeHoursLater = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
            const productMap: { [sku: string]: { name: string; totalStock: number; expiringSoon: number } } = {};
            for (let product of productData) {
                for (const key of Object.keys(spaces)) {
                    const availableProducts = await getSpaceProducts(spaces[key].id, product.sku);
                    if (!availableProducts) {
                        continue;
                    }
                    availableProducts.forEach((product: any) => {
                        const expirationTime = new Date(product.expiresAt); 
                        const isExpiringSoon = expirationTime <= threeHoursLater;

                        if (productMap[product.sku]) {
                            productMap[product.sku].totalStock += 1; 
                            if (isExpiringSoon) {
                                productMap[product.sku].expiringSoon += 1; 
                            }
                        } else {
                            productMap[product.sku] = {
                                name: product.name,
                                totalStock: 1,
                                expiringSoon: isExpiringSoon ? 1 : 0,
                            };
                        }
                    });

                    const transformedData = Object.keys(productMap).map((sku) => ({
                        sku,
                        name: productMap[sku].name,
                        totalStock: productMap[sku].totalStock,
                        expiringSoon: productMap[sku].expiringSoon,
                    }));

                    setProductCounts(transformedData);
                }
            }}

        fetchProducts();
    }, [products, spaces]);

    return (
        <div>
            <h1>Stock y Productos por Vencer</h1>
            {productCounts.length > 0 ? (
                <BarChart 
                    width={730} 
                    height={250} 
                    data={productCounts} 
                    margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sku">
                        <Label value="Productos" offset={0} position="insideBottom" />
                    </XAxis>
                    <YAxis label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {/*stock total */}
                    <Bar dataKey="totalStock" fill="#8884d8">
                        <LabelList dataKey="name" position="top" />
                    </Bar>
                    {/*productos por vencer */}
                    <Bar dataKey="expiringSoon" fill="#82ca9d">
                        <LabelList dataKey="expiringSoon" position="top" />
                    </Bar>
                </BarChart>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}
