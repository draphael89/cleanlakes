'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const features = [
  { title: 'Lake Data', description: 'Access comprehensive data on lakes across the United States.', icon: 'data' },
  { title: 'Interactive Maps', description: 'Explore lakes using our interactive mapping tools.', icon: 'map' },
  { title: 'Water Quality Insights', description: 'Get real-time updates on water quality and environmental factors.', icon: 'quality' },
  { title: 'Community Reports', description: 'Contribute and access community-driven lake reports.', icon: 'community' },
];

const FeatureIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const icons = {
    data: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
      </svg>
    ),
    map: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
      </svg>
    ),
    quality: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" />
      </svg>
    ),
    community: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 3.117 6.516 6.516 0 01-2.871 2.249 6.515 6.515 0 01-7.676 0 6.516 6.516 0 01-2.871-2.249zM15.75 15.75a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM8.25 15.75a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" clipRule="evenodd" />
      </svg>
    ),
  };

  return icons[icon as keyof typeof icons] || null;
};

const FeatureCard: React.FC<{ feature: typeof features[0]; index: number }> = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl overflow-hidden transform transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm"
    >
      <div className="p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        <motion.div 
          className="text-5xl mb-6 text-blue-400 relative z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          <FeatureIcon icon={feature.icon} />
        </motion.div>
        <motion.h3 
          className="text-2xl font-semibold mb-4 text-white relative z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p 
          className="text-blue-100 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
        >
          {feature.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 top-1/2 bg-gradient-to-t from-blue-800 to-transparent" />
        <svg className="absolute left-0 top-0 h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1200 800">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 0 300 Q 300 150 600 300 T 1200 300 V 800 H 0 Z" 
            stroke="url(#gradient)" 
            strokeWidth="2" 
            fill="none"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 text-white relative inline-block">
            Our Features
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-50 blur-lg -z-10"></span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover the powerful tools and insights cleanlakes.ai offers to help you explore and protect our precious water resources.
          </p>
        </motion.div>
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;