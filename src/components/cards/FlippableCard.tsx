'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FlippableCardProps {
  question: string;

  // Mode 1 : image-based
  image?: string;
  backImage?: string;
  backColor?: string;

  // Mode 2 : emoji/text-based
  icon?: string;
  frontLabel?: string;
  styleType?: 'challenge' | 'family' | 'creativity' | 'reflection';

  ageSuitability?: 'all' | 'kids' | 'teens' | 'parents';
}

const styleMap: Record<string, string> = {
  challenge: 'bg-yellow-100 text-yellow-800',
  family: 'bg-green-100 text-green-800',
  creativity: 'bg-purple-100 text-purple-800',
  reflection: 'bg-blue-100 text-blue-800',
};

export function FlippableCard({
  question,
  image,
  backImage,
  backColor = '',
  icon,
  frontLabel,
  styleType = 'reflection',
}: FlippableCardProps) {
  const [flipped, setFlipped] = useState(false);

  const isImageMode = image && backImage;

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="relative w-[200px] h-[280px] perspective-1000 cursor-pointer"
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-500 transform-style-preserve-3d',
          flipped ? 'rotateY-180' : ''
        )}
      >
        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg">
          {isImageMode ? (
            <Image src={image!} alt="front" fill className="object-cover" />
          ) : (
            <div
              className={cn(
                'w-full h-full flex flex-col items-center justify-center p-4 text-center',
                styleMap[styleType]
              )}
            >
              <div className="text-4xl">{icon}</div>
              <div className="mt-4 font-bold text-lg">{frontLabel}</div>
            </div>
          )}
        </div>

        {/* BACK */}
        <div
          className={cn(
            'absolute w-full h-full backface-hidden rotateY-180 flex items-center justify-center rounded-xl overflow-hidden shadow-lg',
            isImageMode ? backColor : 'bg-white'
          )}
          style={
            isImageMode
              ? {
                  backgroundImage: `url(${backImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                }
              : {}
          }
        >
          <p className="z-10 text-sm text-center px-4">{question}</p>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotateY-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
