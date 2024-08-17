'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

const LakeMap = dynamic(() => import('./LakeMap'), { ssr: false });
const LakeDataChart = dynamic(() => import('./LakeDataChart'));
const WeatherInfo = dynamic(() => import('./WeatherInfo'));
const NearbyAttractions = dynamic(() => import('./NearbyAttractions'));
const RelatedLakes = dynamic(() => import('./RelatedLakes'));

interface Lake {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
  statistics: {
    area: number;
    maxDepth: number;
    averageDepth: number;
  };
  waterQuality: string; // Changed to string to match page.tsx
  activities: string[];
}

interface LakeDetailsProps {
  lake: Lake;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
    <p className="font-bold">Oops! Something went wrong:</p>
    <pre className="mt-2 text-sm">{error.message}</pre>
    <button 
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Try again
    </button>
  </div>
);

const LakeDetails: React.FC<LakeDetailsProps> = ({ lake }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{lake.name}</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">{lake.description}</p>
        </section>

        <section className="relative h-[50vh] md:h-[60vh] rounded-lg overflow-hidden">
          <Image
            src={lake.imageUrl}
            alt={lake.name}
            layout="fill"
            objectFit="cover"
            priority
            className="transition-transform duration-300 hover:scale-105"
          />
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Lake Statistics</h2>
            <ul className="space-y-2">
              <li>Area: {lake.statistics.area} km²</li>
              <li>Max Depth: {lake.statistics.maxDepth} m</li>
              <li>Average Depth: {lake.statistics.averageDepth} m</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Water Quality</h2>
            <p>{lake.waterQuality}</p>
          </motion.div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Activities</h2>
          <ul className="list-disc list-inside">
            {lake.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </section>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <LakeMap latitude={lake.location.latitude} longitude={lake.location.longitude} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <LakeDataChart lakeId={lake.id} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <WeatherInfo location={lake.location} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div className="h-60 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <NearbyAttractions location={lake.location} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <RelatedLakes currentLakeId={lake.id} />
          </Suspense>
        </ErrorBoundary>
      </motion.div>
    </div>
  );
};

export default LakeDetails;