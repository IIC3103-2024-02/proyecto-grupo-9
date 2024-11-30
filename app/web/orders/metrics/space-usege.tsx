'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getSpacesDetails } from '@/actions/space/get-spaces-details'; 
import { SpaceData } from '@/actions/space/get-spaces-details';
import {SpaceDictionary} from '@/actions/space/get-spaces-details';



interface SpaceUsageChartProps {
  data: {
    name: string;
    usedSpace: number;
    totalSpace: number;
    percentageUsed: number;
  }[];
}

interface DashboardProps {
  spaces: SpaceDictionary;
}

function SpaceUsageChart({ data }: SpaceUsageChartProps) {
    return (
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 20, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usedSpace" fill="#8884d8" />
            <Bar dataKey="totalSpace" fill="#82ca9d" />
        </BarChart>
    );
}

function Dashboard({ spaces }: DashboardProps) {
    const chartData = Object.keys(spaces).map((key) => {
        const space = spaces[key];
        const adjustedTotalSpace = space.totalSpace > 5000 ? space.usedSpace : space.totalSpace;
        return {
            name: space.name,
            usedSpace: space.usedSpace,
            totalSpace: adjustedTotalSpace,
            percentageUsed: (space.usedSpace / space.totalSpace) * 100,
        };
    });

    return (
        <div>
            <h1>Espacio utilizado en cada espacio de la cafetería</h1>
            <SpaceUsageChart data={chartData} />
        </div>
    );
}

export default Dashboard;
