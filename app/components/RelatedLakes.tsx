'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface RelatedLake {
  id: string;
  name: string;
  imageUrl: string;
}

interface RelatedLakesProps {
  currentLakeId: string;
}

const RelatedLakes: React.FC<RelatedLakesProps> = ({ currentLakeId }) => {
  const [relatedLakes, setRelatedLakes] = useState<RelatedLake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedLakes = async () => {
      try {
        const response = await fetch(`/api/lakes/related?current=${encodeURIComponent(currentLakeId)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch related lakes');
        }
        const data = await response.json();
        setRelatedLakes(data);
      } catch (err) {
        setError('Error fetching related lakes');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedLakes();
  }, [currentLakeId]);

  if (loading) return <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div 
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedLakes.map((lake, index) => (
          <motion.div
            key={lake.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/lakes/${lake.id}`}>
              <a className="block bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="relative h-48">
                  <Image
                    src={lake.imageUrl}
                    alt={lake.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{lake.name}</h3>
                </div>
              </a>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedLakes;