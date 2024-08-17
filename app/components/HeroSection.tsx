'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { useSpring, useSprings, animated, to as interpolate } from '@react-spring/web';
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

const VISIBLE_CARDS = 3;
const CARD_WIDTH = 280;
const CARD_SPACING = 20;

// Custom hook for smooth carousel scrolling
const useCarousel = (items: Lake[], visibleItems: number) => {
  const [index, setIndex] = useState(0);
  const [props, api] = useSpring(() => ({
    x: 0,
    config: { mass: 1, tension: 180, friction: 24 },
  }));

  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > CARD_WIDTH / 2) {
      const newIndex = index + (xDir > 0 ? -1 : 1);
      setIndex(clamp(newIndex, 0, items.length - visibleItems));
      cancel();
    }
    api.start({ x: active ? mx : 0, immediate: active });
  }, {
    axis: 'x',
    bounds: { left: -CARD_WIDTH, right: CARD_WIDTH },
    rubberband: true,
  });

  useEffect(() => {
    api.start({ x: -index * (CARD_WIDTH + CARD_SPACING) });
  }, [index, api]);

  return { index, setIndex, props, bind };
};

// Custom hook for logging
const useLogger = (componentName: string) => {
  return useCallback((message: string, data?: any) => {
    console.log(`[${componentName}] ${message}`, data);
  }, [componentName]);
};

// Utility function to clamp a number between two values
const clamp = (number: number, lower: number, upper: number) => 
  Math.max(lower, Math.min(number, upper));

// Water effect component
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 z-0" />;
};

const HeroSection: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom logger
  const log = useLogger('HeroSection');

  // Scroll animation setup
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);

  // Carousel setup
  const { index: carouselIndex, setIndex: setCarouselIndex, props: carouselProps, bind: carouselBind } = useCarousel(mockLakes, VISIBLE_CARDS);

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

  // Render individual carousel cards
  const renderCards = useCallback(() => {
    const centerIndex = Math.floor(VISIBLE_CARDS / 2);
    return mockLakes.map((lake, i) => {
      const position = i - (carouselIndex + centerIndex);
      return (
        <animated.div
          key={lake.id}
          className="absolute touch-none"
          style={{
            transform: carouselProps.x.to(x => `translateX(calc(${x}px + ${position * (CARD_WIDTH + CARD_SPACING)}px))`),
            left: `calc(50% - ${CARD_WIDTH / 2}px)`,
            zIndex: mockLakes.length - Math.abs(position),
          }}
        >
          <div
            className="w-[280px] h-[400px] relative rounded-xl overflow-hidden shadow-xl card-glow cursor-pointer"
            onClick={() => window.location.href = `/lakes/${lake.id}`}
          >
            <Image
              src={lake.image}
              alt={lake.name}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold mb-2">{lake.name}</h3>
              <p className="text-sm">{lake.description}</p>
            </div>
          </div>
        </animated.div>
      );
    });
  }, [carouselProps.x, carouselIndex]);

  // Render navigation arrows for carousel
  const renderArrows = useCallback(() => (
    <>
      <button
        onClick={() => setCarouselIndex(state => clamp(state - 1, 0, mockLakes.length - VISIBLE_CARDS))}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCarouselIndex(state => clamp(state + 1, 0, mockLakes.length - VISIBLE_CARDS))}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-200"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  ), [setCarouselIndex]);

  // Render navigation dots for carousel
  const renderNavigation = useCallback(() => (
    <div className="absolute -bottom-12 left-0 right-0 flex justify-center space-x-2">
      {mockLakes.map((_, i) => (
        <button
          key={i}
          onClick={() => setCarouselIndex(i)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i === carouselIndex ? 'bg-accent-light dark:bg-accent-dark' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  ), [carouselIndex, setCarouselIndex]);

  // Handle keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCarouselIndex(state => clamp(state - 1, 0, mockLakes.length - VISIBLE_CARDS));
      } else if (e.key === 'ArrowRight') {
        setCarouselIndex(state => clamp(state + 1, 0, mockLakes.length - VISIBLE_CARDS));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCarouselIndex]);

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
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="font-serif">Dive into</span>{' '}
            <span className="relative inline-block">
              <span className="relative z-10">AI-Powered</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 opacity-75 blur-lg -z-10 animate-pulse"></span>
            </span>{' '}
            <span className="font-sans">Lake Insights</span>
          </motion.h1>
          <motion.p 
            className="mb-8 text-xl sm:text-2xl md:text-3xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover and protect America&apos;s waters with cutting-edge technology
          </motion.p>
        </motion.div>

        {/* Search section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-2xl mb-16 relative"
        >
          <div className="relative">
            <WaterEffect />
            <div className="glass-effect rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
              <motion.h2 
                className="text-3xl sm:text-4xl font-semibold mb-6 text-white text-center relative inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <span className="relative z-10">Explore Your Local Waters</span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-75 blur-lg -z-10 animate-pulse"></span>
              </motion.h2>
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
            {...carouselBind()}
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

const toBase64 = (str: string) => {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return window.btoa(str);
};

export default HeroSection;