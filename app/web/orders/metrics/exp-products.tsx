'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Label } from 'recharts';
import { getProducts } from '@/actions/product/get-products';

interface ProductCount {
  sku: string;
  name: string;
  totalStock: number; 
  expiringSoon: number; 
}

export default function StockAndExpirationDashboard() {
  const [productCounts, setProductCounts] = useState<ProductCount[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const productData = await getProducts();
      const currentTime = new Date();

      // Definir un rango de 3 horas
      const threeHoursLater = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
      const productMap: { [sku: string]: { name: string; totalStock: number; expiringSoon: number } } = {};

      productData.forEach((product: any) => {
        const expirationTime = new Date(product.expiration); 
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

    fetchProducts();
  }, []);

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
