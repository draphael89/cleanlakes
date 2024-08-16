'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// Dynamic imports for client-side components
const LakeDataChart = dynamic(() => import('./LakeDataChart'), {
  loading: () => <p>Loading chart...</p>
});
const AIGeneratedContent = dynamic(() => import('./AIGeneratedContent'), {
  loading: () => <p>Loading AI content...</p>
});
const MapboxMap = dynamic(() => import('./MapboxMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

interface WeatherData {
  temperature: number;
  precipitation: number;
}

interface WaterData {
  temperature: number;
  level: number;
}

interface BiodiversityData {
  speciesCount: number;
}

interface LakeData {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  weatherData: WeatherData;
  waterData: WaterData;
  biodiversityData: BiodiversityData;
}

interface ChartDataPoint {
  date: string;
  waterLevel: number;
  temperature: number;
}

interface LakeDetailsProps {
  lakeData: LakeData;
  chartData: ChartDataPoint[];
}

const LakeDetails: React.FC<LakeDetailsProps> = ({ lakeData, chartData }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{lakeData.name}</h1>
      <p className="text-xl mb-2">State: {lakeData.state}</p>
      
      <ErrorBoundary fallback={<div>Error loading map</div>}>
        <Suspense fallback={<div>Loading map...</div>}>
          <div className="mb-6">
            <MapboxMap latitude={lakeData.latitude} longitude={lakeData.longitude} zoom={10} />
          </div>
        </Suspense>
      </ErrorBoundary>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Weather</h2>
          <p>Temperature: {lakeData.weatherData.temperature}°C</p>
          <p>Precipitation: {lakeData.weatherData.precipitation} mm</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Water Data</h2>
          <p>Water Temperature: {lakeData.waterData.temperature}°C</p>
          <p>Water Level: {lakeData.waterData.level} m</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Biodiversity</h2>
          <p>Species Count: {lakeData.biodiversityData.speciesCount}</p>
        </div>
      </div>

      <ErrorBoundary fallback={<div>Error loading chart</div>}>
        <Suspense fallback={<div>Loading chart...</div>}>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Historical Data</h2>
            <LakeDataChart data={chartData} />
          </div>
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<div>Error loading AI content</div>}>
        <Suspense fallback={<div>Loading AI content...</div>}>
          <AIGeneratedContent lakeName={lakeData.name} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default LakeDetails;