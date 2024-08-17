'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherInfoProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ location }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?lat=${location.latitude}&lon=${location.longitude}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading) return <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!weather) return null;

  return (
    <motion.div 
      className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            alt={weather.description} 
            className="w-16 h-16 mr-4"
          />
          <div>
            <p className="text-3xl font-bold">{weather.temperature}°C</p>
            <p className="text-xl capitalize">{weather.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm">Humidity: {weather.humidity}%</p>
          <p className="text-sm">Wind: {weather.windSpeed} m/s</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherInfo;