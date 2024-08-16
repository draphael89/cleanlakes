'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Lake {
  _id: string;
  name: string;
  state: string;
  lastUpdated: string;
}

const LakeCard: React.FC<{ lake: Lake }> = ({ lake }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
  >
    <Link href={`/lakes/${lake._id}`}>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">{lake.name}</h2>
        <p className="text-gray-600 mb-2">{lake.state}</p>
        <p className="text-sm text-gray-500">Last updated: {new Date(lake.lastUpdated).toLocaleString()}</p>
      </div>
      <div className="bg-blue-100 p-3 text-blue-700 text-center font-medium">
        View Details
      </div>
    </Link>
  </motion.div>
);

const LakesList: React.FC = () => {
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLakes() {
      try {
        const response = await fetch('/api/lakes');
        if (!response.ok) {
          throw new Error('Failed to fetch lakes');
        }
        const data = await response.json();
        setLakes(data);
      } catch (err) {
        setError('Error fetching lakes');
      } finally {
        setLoading(false);
      }
    }
    fetchLakes();
  }, []);

  if (loading) return <div className="text-center py-10">Loading lakes...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Explore Clean Lakes</h1>
      <div role="list" aria-label="List of lakes">
        {lakes.map((lake) => (
          <div key={lake._id} role="listitem">
            <LakeCard lake={lake} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LakesList;