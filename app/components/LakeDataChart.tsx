'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  temperature: number;
  waterLevel: number;
}

interface LakeDataChartProps {
  lakeId: string;
}

const LakeDataChart: React.FC<LakeDataChartProps> = ({ lakeId }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/lakes/${lakeId}/data`);
        if (!response.ok) {
          throw new Error('Failed to fetch lake data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Error fetching lake data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lakeId]);

  if (loading) return <div>Loading chart data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Lake Data Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Water Level (m)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} name="Temperature (°C)" />
          <Line yAxisId="right" type="monotone" dataKey="waterLevel" stroke="#82ca9d" name="Water Level (m)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LakeDataChart;