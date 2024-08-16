'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';

const WavesSVG: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
    <motion.path
      initial={{ d: "M0,160L48,160C96,160,192,160,288,160C384,160,480,160,576,160C672,160,768,160,864,160C960,160,1056,160,1152,160C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
      animate={{
        d: [
          "M0,160L48,160C96,160,192,160,288,160C384,160,480,160,576,160C672,160,768,160,864,160C960,160,1056,160,1152,160C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          "M0,165L48,164C96,163,192,161,288,161C384,161,480,163,576,163C672,163,768,161,864,161C960,161,1056,163,1152,164C1248,165,1344,165,1392,165L1440,165L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          "M0,160L48,160C96,160,192,160,288,160C384,160,480,160,576,160C672,160,768,160,864,160C960,160,1056,160,1152,160C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
        ],
      }}
      transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      fill="url(#gradient)"
      fillOpacity="0.2"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#2563EB" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
);

const CallToActionSection: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700">
      <WavesSVG />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 flex flex-col md:flex-row items-center">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: 'easeOut' } },
          }}
          className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
        >
          <motion.h2 
            className="text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
          >
            <span className="relative inline-block">
              Discover Tranquil Lakes
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-blue-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
              />
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2 }}
          >
            Join cleanlakes.ai today and embark on a serene journey to explore, protect, and cherish our nation&apos;s pristine lakes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1.2 }}
          >
            <Link 
              href="/lakes"
              className="inline-block bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-4 rounded-full text-xl font-semibold
                transition-all duration-300 ease-in-out
                hover:from-blue-500 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/50
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                transform hover:scale-105 active:scale-95"
            >
              Begin Your Lake Journey
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToActionSection;