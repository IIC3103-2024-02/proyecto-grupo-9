'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label, LabelList } from 'recharts';
import { getSpaces } from "@/actions/space/get-spaces";
import { useEffect, useState } from 'react';

export default function Page() {
    return (
        <div>
            <h1>Métricas de la Cafetería</h1>

            <h2>Espacio utilizado en cada espacio de la cafetería</h2>
        </div>
    );
}
