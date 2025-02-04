'use client';

import createGlobe from 'cobe';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let phi = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;

    const initializeGlobe = () => {
      if (canvasRef.current) {
        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: window.devicePixelRatio || 2,
          width: 350 * 2, // Double resolution for crisp rendering
          height: 350 * 2,
          phi: 0.25,
          theta: 0.7,
          dark: resolvedTheme === 'dark' ? 1 : 0,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: resolvedTheme === 'dark' ? [0.1, 0.1, 0.1] : [0.92, 0.92, 0.92],
          markerColor: [226 / 255, 54 / 255, 112 / 255],
          glowColor: [42 / 255, 182 / 255, 187 / 255],
          markers: [
            { location: [-33.9249, 18.4241], size: 0.05 }, // Cape Town
            { location: [-29.8587, 31.0218], size: 0.05 }, // Durban
            { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo
            { location: [-34.6037, -58.3816], size: 0.05 }, // Buenos Aires
            { location: [-12.0464, -77.0428], size: 0.05 }, // Lima
            { location: [-33.4489, -70.6693], size: 0.05 }, // Santiago
            { location: [4.711, -74.0721], size: 0.05 },
            // Bogotá
            { location: [36.8065, 10.1815], size: 0.05 }, // Tunis
          ],
          onRender: (state) => {
            state.phi = phi;
            phi += 0.01;
          },
        });
      }
    };

    initializeGlobe();

    return () => {
      if (globe) globe.destroy();
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: 310, height: 310, maxWidth: '350px', aspectRatio: 1 }}
    />
  );
};
