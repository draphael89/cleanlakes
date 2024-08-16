'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface WaterBackgroundProps {
  waveHeight?: number;
  waveSpeed?: number;
  waveColor?: string;
}

const WaterBackground: React.FC<WaterBackgroundProps> = React.memo(({
  waveHeight = 10,
  waveSpeed = 0.03,
  waveColor = 'rgba(0, 168, 232, 0.1)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scrollY, setScrollY] = useState(0);
  const animationRef = useRef<number>();

  const updateDimensions = useCallback(() => {
    if (canvasRef.current) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('scroll', () => setScrollY(window.scrollY));
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', () => setScrollY(window.scrollY));
    };
  }, [updateDimensions]);

  const drawWave = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = dimensions;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height);

    const step = Math.max(1, Math.floor(width / 100));
    for (let x = 0; x <= width; x += step) {
      const y = Math.sin(x * 0.01 + time * waveSpeed) * waveHeight + height / 2 + scrollY * 0.1;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.fillStyle = waveColor;
    ctx.fill();
  }, [dimensions, waveHeight, waveSpeed, waveColor, scrollY]);

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      drawWave(ctx, time);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [drawWave]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className="water-background fixed inset-0 z-0" aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
});

WaterBackground.displayName = 'WaterBackground';

export default WaterBackground;