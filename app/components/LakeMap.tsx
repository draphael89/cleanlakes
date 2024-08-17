'use client';

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Ensure you have the NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface LakeMapProps {
  latitude: number;
  longitude: number;
}

const LakeMap: React.FC<LakeMapProps> = ({ latitude, longitude }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [longitude, latitude],
        zoom: 9
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }
  }, [latitude, longitude]);

  return <div ref={mapContainer} className="h-96 w-full rounded-lg overflow-hidden" />;
};

export default LakeMap;