'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  zoom: number;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ latitude, longitude, zoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment and if the map hasn't been initialized
    if (typeof window === 'undefined' || map.current) return;

    // Ensure mapContainer.current is not null
    if (!mapContainer.current) {
      console.error('Map container is not available');
      return;
    }

    const initializeMap = async () => {
      // Get the Mapbox access token from environment variables
      const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!mapboxAccessToken) {
        console.error('Mapbox access token is not defined');
        return;
      }

      // Set the access token
      mapboxgl.accessToken = mapboxAccessToken;

      try {
        // Create a new Map instance with type assertion
        map.current = new mapboxgl.Map({
          container: mapContainer.current as HTMLElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [longitude, latitude],
          zoom: zoom
        });

        // Set mapLoaded to true when the map is fully loaded
        map.current.on('load', () => {
          setMapLoaded(true);
        });
      } catch (error) {
        console.error('Error initializing Mapbox map:', error);
      }
    };

    initializeMap();

    // Cleanup function to remove the map when the component unmounts
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, zoom]);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
};

export default MapboxMap;