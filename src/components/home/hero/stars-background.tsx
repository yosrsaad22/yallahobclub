'use client';
import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';
import { cn } from '@/lib/utils';

export const StarBackground = (props: any) => {
  const ref: any = useRef();

  // Generate the positions within a sphere and ensure no NaN values
  const generateSpherePositions = (count: number, radius: number) => {
    const positions = new Float32Array(count * 3);
    random.inSphere(positions, { radius });
    return positions;
  };

  const [sphere] = useState(() => generateSpherePositions(1800, 1.2));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 30;
    ref.current.rotation.y -= delta / 40;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial transparent color="white" size={0.002} sizeAttenuation={true} dethWrite={false} />
      </Points>
    </group>
  );
};

const StarsCanvas = ({ props }: { props: string }) => (
  <div className={cn(props, ' inset-0 z-[0] h-full w-full')}>
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;
