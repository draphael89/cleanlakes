import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  temperature: number;
  waterLevel: number;
}

interface LakeDataChartProps {
  data: DataPoint[];
}

const LakeDataChart: React.FC<LakeDataChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Water Level (m)', angle: 90, position: 'insideRight' }} />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="waterLevel" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LakeDataChart;