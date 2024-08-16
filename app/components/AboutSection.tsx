'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const AboutSection: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const items = [
    { title: 'Data-Driven Insights', description: 'Leverage cutting-edge analytics to understand lake ecosystems.', icon: '📊' },
    { title: 'Community Engagement', description: 'Connect with fellow lake enthusiasts and conservationists.', icon: '🤝' },
    { title: 'Conservation Efforts', description: 'Support initiatives to preserve and protect our valuable water resources.', icon: '🌿' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800">
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
          variants={containerVariants}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 text-white relative inline-block">
            About <span className="text-blue-300">cleanlakes.ai</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-50 blur-lg -z-10"></span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            cleanlakes.ai is a cutting-edge platform dedicated to providing comprehensive information about lakes across the United States. Our mission is to promote environmental awareness and conservation efforts through data-driven insights and community engagement.
          </p>
        </motion.div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl overflow-hidden transform transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm"
            >
              <div className="p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <motion.div 
                  className="text-6xl mb-6 text-blue-300 relative z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 * index }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 text-white relative z-10">
                  {item.title}
                </h3>
                <p className="text-blue-100 relative z-10">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <WaterEffect />
    </section>
  );
};

const WaterEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 200;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      
      for (let x = 0; x < canvas.width; x += 20) {
        const y = Math.sin(x * 0.01 + time) * 20 + 100;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-50 opacity-30" />;
};

export default AboutSection;