'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IBalance } from '@/models/Balance';


function formatHour(dateString: string) {
    const date = new Date(dateString);
    return date.getUTCHours() + ":00"; // hora en UTC
}

interface SaldoLineChartProps {
    balances: IBalance[];
}

function SaldoLineChart({ balances: b }: SaldoLineChartProps) {
    const [balances, setBalances] = useState<IBalance[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (b.length > 0) {
            setBalances(b);
        }
    }, [b]);
    useEffect(() => {

        const balanceByHour: { [key: string]: number  } = {};
        let lastBalance = 0;

        balances.forEach(balance => {
            const hour = formatHour(balance.createdAt.toString());
            balanceByHour[hour] = balance.balance; 
            lastBalance = balance.balance;
        });

        const formattedData = Object.keys(balanceByHour).map(hour => ({
            name: hour,
            saldo: balanceByHour[hour] ?? lastBalance,
        }));

        setChartData(formattedData);
    }, [balances]);

    return (
        <div>
            <h2>Balance por hora</h2>
            {chartData.length > 0 ? (
                <LineChart
                    width={730}
                    height={250}
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Hora (UTC)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Balance', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="saldo" stroke="#8884d8" name="Saldo" />
                </LineChart>
            ) : (
                <p>Cargando datos de balance...</p>
            )}
        </div>
    );
}

export default SaldoLineChart;
