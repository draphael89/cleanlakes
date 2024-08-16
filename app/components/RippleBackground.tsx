import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSpring, useSprings, animated, config } from '@react-spring/web';

interface RippleProps {
  count: number;
}

const useLogger = (componentName: string) => {
  return useCallback((message: string, data?: any) => {
    console.log(`[${componentName}] ${message}`, data);
  }, [componentName]);
};

const RippleBackground: React.FC<RippleProps> = React.memo(({ count }) => {
  const log = useLogger('RippleBackground');
  const isOver = useRef(false);

  const gridItems = useMemo(() => new Array(count).fill(null), [count]);

  const [springs, api] = useSprings(count, i => ({
    from: {
      scale: 1,
      opacity: 0.1,
      x: (i % Math.sqrt(count)) * (100 / Math.sqrt(count)),
      y: Math.floor(i / Math.sqrt(count)) * (100 / Math.sqrt(count)),
      rotation: 0,
    },
    config: {
      ...config.gentle,
      friction: 50 + Math.random() * 30,
    },
  }), [count]);

  const [{ mouseX, mouseY }, mouseApi] = useSpring(() => ({ 
    mouseX: 0, 
    mouseY: 0,
    config: config.gentle,
  }));

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const { clientX, clientY } = 'touches' in event ? event.touches[0] : event;
      mouseApi.start({ mouseX: clientX, mouseY: clientY });
    },
    [mouseApi]
  );

  const animateRipples = useCallback(() => {
    api.start(i => {
      const dx = springs[i].x.get() - mouseX.get();
      const dy = springs[i].y.get() - mouseY.get();
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);
      return {
        scale: 1 + Math.max(0, 1 - distance / (maxDistance * 0.1)) * 0.5,
        opacity: 0.1 + Math.max(0, 1 - distance / (maxDistance * 0.1)) * 0.5,
        rotation: (distance / maxDistance) * 360,
        config: { tension: 300, friction: 20 },
      };
    });
  }, [api, springs, mouseX, mouseY]);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      animateRipples();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    log('Animation started');
    return () => {
      cancelAnimationFrame(animationFrame);
      log('Animation stopped');
    };
  }, [animateRipples, log]);

  useEffect(() => {
    const handleResize = () => {
      api.start(i => ({
        x: (i % Math.sqrt(count)) * (100 / Math.sqrt(count)),
        y: Math.floor(i / Math.sqrt(count)) * (100 / Math.sqrt(count)),
      }));
      log('Window resized, ripples repositioned');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [api, count, log]);

  const getColor = useCallback((x: number, y: number) => {
    const hue = (x + y) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseEnter={() => { isOver.current = true; log('Mouse entered'); }}
      onMouseLeave={() => { isOver.current = false; log('Mouse left'); }}
      aria-hidden="true"
    >
      {springs.map((props, i) => (
        <animated.div
          key={i}
          style={{
            position: 'absolute',
            willChange: 'transform, opacity',
            transform: props.rotation.to(r => `rotate(${r}deg)`),
            ...props,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: '20vmin',
              height: '20vmin',
              filter: 'blur(8px)',
              background: getColor(props.x.get(), props.y.get()),
            }}
          />
        </animated.div>
      ))}
    </div>
  );
});

RippleBackground.displayName = 'RippleBackground';

export default RippleBackground;