'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { useSpringRef, useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

// Define the structure for a Lake object
interface Lake {
  id: string;
  name: string;
  image: string;
  description: string;
}

// Mock data for lakes
const mockLakes: Lake[] = [
  { id: '1', name: 'Lake Michigan', image: '/images/lake-michigan.jpg', description: 'One of the five Great Lakes of North America' },
  { id: '2', name: 'Lake Tahoe', image: '/images/lake-tahoe.jpg', description: 'A large freshwater lake in the Sierra Nevada' },
  { id: '3', name: 'Crater Lake', image: '/images/crater-lake.jpg', description: 'The deepest lake in the United States' },
  { id: '4', name: 'Lake Superior', image: '/images/lake-superior.jpg', description: 'The largest of the Great Lakes of North America' },
  { id: '5', name: 'Lake Powell', image: '/images/lake-powell.jpg', description: 'A reservoir on the Colorado River' },
];

const VISIBLE_CARDS = 5;
const CARD_WIDTH = 300;
const CARD_SPACING = 20;

// Function to calculate the position and style of each card
const to = (i: number) => ({
  x: i * (CARD_WIDTH + CARD_SPACING),
  scale: 1 - Math.abs(i) * 0.1,
  opacity: 1 - Math.abs(i) * 0.2,
});

// Custom hook for logging
const useLogger = (componentName: string) => {
  return useCallback((message: string, data?: any) => {
    console.log(`[${componentName}] ${message}`, data);
  }, [componentName]);
};

// Custom hook to manage carousel springs
const useCarouselSprings = (items: Lake[], index: number) => {
  const springApi = useSpringRef();
  const springs = useSprings(
    items.length,
    items.map((_, i) => ({
      ...to(i - index),
      config: { mass: 5, tension: 350, friction: 40 },
    }))
  );

  useEffect(() => {
    springApi.start((i) => to(i - index));
  }, [springApi, index]);

  return springs;
};

const HeroSection: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom logger
  const log = useLogger('HeroSection');

  // Scroll animation setup
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);

  // Carousel springs
  const springs = useCarouselSprings(mockLakes, carouselIndex);

  // Debounced search function to prevent excessive API calls
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        log('Performing search', { term });
        setIsLoading(true);
        setError(null);
        try {
          // Simulating API call with setTimeout
          await new Promise(resolve => setTimeout(resolve, 500));
          const results = mockLakes
            .filter(lake => lake.name.toLowerCase().includes(term.toLowerCase()))
            .map(lake => lake.name);
          setSearchResults(results);
          log('Search completed', { results });
        } catch (err) {
          log('Search error', err);
          setError('An error occurred while searching. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [log]
  );

  // Handle input changes in the search bar
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  // Handle key presses in the search bar
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchResults([]);
      setSearchTerm('');
      log('Search cleared');
    }
  }, [log]);

  // Handle drag gestures for carousel
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    setIsDragging(active);
    if (active && Math.abs(mx) > 50) {
      const newIndex = carouselIndex + (xDir > 0 ? -1 : 1);
      setCarouselIndex(clamp(newIndex, 0, mockLakes.length - 1));
      cancel();
    }
  }, {
    delay: 100,
    filterTaps: true,
    bounds: { left: -CARD_WIDTH, right: CARD_WIDTH },
    rubberband: true,
  });

  // Utility function to clamp a number between two values
  const clamp = (number: number, lower: number, upper: number) => 
    Math.max(lower, Math.min(number, upper));

  // Calculate z-index for each card
  const getZIndex = useCallback((i: number) => VISIBLE_CARDS - Math.abs(i - carouselIndex), [carouselIndex]);

  // Handle card click
  const handleCardClick = useCallback((index: number) => {
    if (!isDragging) {
      window.location.href = `/lakes/${mockLakes[index].id}`;
    }
  }, [isDragging]);

  // Render individual carousel cards
  const renderCards = useCallback(() => {
    return springs.map(({ x, scale, opacity }, i) => (
      <animated.div
        key={i}
        className="absolute touch-none"
        style={{
          transform: interpolate([x, scale], (x, s) => `translateX(${x}px) scale(${s})`),
          opacity,
          zIndex: getZIndex(i),
          display: Math.abs(i - carouselIndex) < VISIBLE_CARDS ? 'block' : 'none',
        }}
        {...bind()}
        onClick={() => handleCardClick(i)}
      >
        <animated.div
          className="w-[300px] h-[400px] relative rounded-xl overflow-hidden shadow-xl card-glow cursor-pointer"
        >
          <div className="absolute inset-0 parallax-bg">
            <Image
              src={mockLakes[i].image}
              alt={mockLakes[i].name}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              priority={i === carouselIndex}
              loading={i === carouselIndex ? 'eager' : 'lazy'}
            />
          </div>
          <animated.div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
            style={{
              opacity: opacity.to(o => o * 0.7),
            }}
          />
          <animated.div
            className="absolute bottom-0 left-0 right-0 p-6"
            style={{
              opacity,
              transform: opacity.to(o => `translateY(${(1 - o) * 20}px)`)
            }}
          >
            <h3 className="text-2xl font-bold mb-2 text-white text-shadow">{mockLakes[i].name}</h3>
            <p className="text-sm mb-4 text-white opacity-90 text-shadow">{mockLakes[i].description}</p>
            <button
              className="inline-block bg-accent-light dark:bg-accent-dark text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 shadow-md hover:shadow-lg pulse-animation"
            >
              Learn More
            </button>
          </animated.div>
        </animated.div>
      </animated.div>
    ));
  }, [springs, bind, getZIndex, carouselIndex, handleCardClick]);

  // Render navigation arrows for carousel
  const renderArrows = useCallback(() => (
    <>
      <button
        onClick={() => setCarouselIndex((state) => (state > 0 ? state - 1 : mockLakes.length - 1))}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCarouselIndex((state) => (state < mockLakes.length - 1 ? state + 1 : 0))}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-200"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  ), []);

  // Render navigation dots for carousel
  const renderNavigation = useCallback(() => (
    <div className="absolute -bottom-12 left-0 right-0 flex justify-center space-x-2">
      <div className="relative h-3 bg-gray-300 dark:bg-gray-600 rounded-full" style={{ width: `${mockLakes.length * 16}px` }}>
        <animated.div
          className="absolute top-0 left-0 h-full bg-accent-light dark:bg-accent-dark rounded-full transition-all duration-300"
          style={{
            width: '24px',
            transform: interpolate([carouselIndex], (i) => `translateX(${i * 16}px)`)
          }}
        />
      </div>
    </div>
  ), [carouselIndex]);

  // Handle keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCarouselIndex((state) => (state > 0 ? state - 1 : mockLakes.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCarouselIndex((state) => (state < mockLakes.length - 1 ? state + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <motion.div 
        style={{ y }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 flex flex-col items-center"
      >
        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight text-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to <span className="text-accent-light dark:text-accent-dark">cleanlakes.ai</span>
          </motion.h1>
          <motion.p 
            className="mb-8 text-lg sm:text-xl md:text-2xl text-white opacity-90 max-w-2xl mx-auto text-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover and protect lakes across the United States with cutting-edge AI technology
          </motion.p>
        </motion.div>

                {/* Search section */}
                <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-2xl mb-16"
        >
          <div className="glass-effect rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white text-center text-shadow">Find Your Lake</h2>
            <div className="relative mb-6">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for a lake..."
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                aria-label="Search for a lake"
                className="w-full px-6 py-4 rounded-full text-lg bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark transition-all duration-300"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light dark:border-primary-dark"></div>
                </div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: searchResults.length > 0 ? 1 : 0, y: searchResults.length > 0 ? 0 : -10 }}
              transition={{ duration: 0.3 }}
            >
              {searchResults.length > 0 && (
                <ul className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-lg overflow-hidden">
                  {searchResults.map((result, index) => (
                    <motion.li
                      key={result}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/lakes/${encodeURIComponent(result.toLowerCase().replace(' ', '-'))}`} className="block px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        {result}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
            {error && (
              <motion.p 
                className="text-red-500 dark:text-red-400 mt-4 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Lake Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-white text-shadow">
            Featured Lakes
          </h2>
          <div 
            ref={containerRef} 
            className="relative h-[500px] flex justify-center items-center touch-pan-y"
            tabIndex={0}
            style={{ transform: 'translateX(-50%)' }}
          >
            {renderCards()}
            {renderArrows()}
          </div>
          {renderNavigation()}
        </motion.div>
      </motion.div>
    </section>
  );
};

// Helper function to generate blur placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default HeroSection;