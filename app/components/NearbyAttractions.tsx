'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Attraction {
  id: string;
  name: string;
  description: string;
  distance: number;
}

interface NearbyAttractionsProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

const NearbyAttractions: React.FC<NearbyAttractionsProps> = ({ location }) => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch(`/api/attractions?lat=${location.latitude}&lon=${location.longitude}`);
        if (!response.ok) {
          throw new Error('Failed to fetch nearby attractions');
        }
        const data = await response.json();
        setAttractions(data);
      } catch (err) {
        setError('Error fetching nearby attractions');
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [location]);

  if (loading) return <div className="h-60 bg-gray-100 animate-pulse rounded-lg"></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Nearby Attractions</h2>
      {attractions.length === 0 ? (
        <p>No nearby attractions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction, index) => (
            <motion.div 
              key={attraction.id} 
              className="bg-white shadow-md rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
                <p className="text-gray-600 mb-4">{attraction.description}</p>
                <p className="text-sm text-gray-500">Distance: {attraction.distance.toFixed(1)} km</p>
                <Link href={`/attractions/${attraction.id}`} className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NearbyAttractions;