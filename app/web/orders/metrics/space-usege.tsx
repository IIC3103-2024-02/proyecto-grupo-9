'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getSpaces } from '@/actions/space/get-spaces'; 


interface Space {
  _id: string;
  usedSpace: number;
  totalSpace: number;
}

interface SpaceUsageChartProps {
  data: {
    name: string;
    usedSpace: number;
    totalSpace: number;
    percentageUsed: number;
  }[];
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

function Dashboard() {
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const spaces = await getSpaces(); 


        if (Array.isArray(spaces)) {
          const transformedSpaces = spaces.map((space: any) => ({
            _id: space._id,
            usedSpace: space.usedSpace,
            totalSpace: space.totalSpace,
          }));

          setSpaces(transformedSpaces); // Asignar datos transformados
        } else {
          console.error("Los datos recibidos no son un array.");
        }
      } catch (error) {
        console.error("Error fetching spaces:", error);
      }
    }

    fetchSpaces();
  }, []);


  const spaceNames: { [key: string]: string } = {
    "66f203ced3f26274cc8b4ff3": "Check-In",
    "66f203ced3f26274cc8b5005": "Buffer",
    "66f203ced3f26274cc8b5007": "Cold",
    "66f203ced3f26274cc8b500d": "Kitchen",
    "66f203cfd3f26274cc8b52bd": "Check-Out",
  };


  const chartData = spaces.map(space => ({
    name: spaceNames[space._id] || space._id, 
    usedSpace: space.usedSpace,
    totalSpace: space.totalSpace,
    percentageUsed: (space.usedSpace / space.totalSpace) * 100 
  }));

  return (
    <div>
      <h1>Espacio utilizado en cada espacio de la cafetería</h1>
      {spaces.length > 0 ? (
        <SpaceUsageChart data={chartData} />
      ) : (
        <p>Cargando datos de los espacios...</p>
      )}
    </div>
  );
}

export default Dashboard;
