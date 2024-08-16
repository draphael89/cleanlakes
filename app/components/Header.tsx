'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            cleanlakes.ai
          </Link>
          <nav className="hidden md:flex space-x-8">
            <ScrollLink to="home" smooth={true} duration={500} offset={-96} className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-dark cursor-pointer">
              Home
            </ScrollLink>
            <ScrollLink to="lakes" smooth={true} duration={500} offset={-96} className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-dark cursor-pointer">
              Lakes
            </ScrollLink>
            <ScrollLink to="about" smooth={true} duration={500} offset={-96} className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-dark cursor-pointer">
              About
            </ScrollLink>
            <ScrollLink to="features" smooth={true} duration={500} offset={-96} className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-dark cursor-pointer">
              Features
            </ScrollLink>
          </nav>
          <div className="md:hidden">
            {/* Add mobile menu button here if needed */}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;