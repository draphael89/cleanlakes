 'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Ensure you have the NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface LakeMapProps {
  latitude: number;
  longitude: number;
  lakeName: string;
  zoom?: number;
}

const LakeMap: React.FC<LakeMapProps> = ({ latitude, longitude, lakeName, zoom = 12 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/outdoors-v11', // Use an outdoors style for better lake visibility
      center: [longitude, latitude],
      zoom: zoom
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, zoom]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Add a marker for the lake
    const marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Add a popup with lake information
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h3>${lakeName}</h3><p>Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}</p>`);

    marker.setPopup(popup);

    // Optional: Add a circle around the lake for visual emphasis
    map.current.addLayer({
      id: 'lake-area',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          properties: {}
        }
      },
      paint: {
        'circle-radius': 100,
        'circle-color': '#007cbf',
        'circle-opacity': 0.3
      }
    });

  }, [mapLoaded, latitude, longitude, lakeName]);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 m-4 bg-white p-2 rounded shadow">
        <p className="text-sm font-semibold">{lakeName}</p>
        <p className="text-xs text-gray-600">Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</p>
      </div>
    </div>
  );
};

export default React.memo(LakeMap);