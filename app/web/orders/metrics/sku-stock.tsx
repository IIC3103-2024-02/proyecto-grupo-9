'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Label } from 'recharts';
import { getProducts } from '@/actions/product/get-products';

interface ProductCount {
  sku: string;
  name: string;
  count: number; 
}

export default function StockDashboard() {
  const [productCounts, setProductCounts] = useState<ProductCount[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const productData = await getProducts();
      const productMap: { [sku: string]: { name: string; count: number } } = {};

      productData.forEach((product: any) => {
        if (productMap[product.sku]) {
          productMap[product.sku].count += 1;
        } else {
          productMap[product.sku] = { name: product.name, count: 1 };
        }
      });

      const transformedData = Object.keys(productMap).map((sku) => ({
        sku,
        name: productMap[sku].name,
        count: productMap[sku].count,
      }));

      setProductCounts(transformedData);
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Stock por SKU</h1>
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
          <Bar dataKey="count" fill="#8884d8">
            <LabelList dataKey="name" position="top" />
          </Bar>
        </BarChart>
      ) : (
        <p>Cargando datos de productos...</p>
      )}
    </div>
  );
}
