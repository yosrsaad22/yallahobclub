'use client';
import React from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { GradientLinkButton } from '@/components/ui/button';

export function ScreenshotParallax() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: 'Screenshot 2',
    thumbnail: '/img/screenshot1.png',
  },
  {
    title: 'Screenshot 1',
    thumbnail: '/img/screenshot2.webp',
  },
  {
    title: 'Screenshot 3',
    thumbnail: '/img/screenshot1.png',
  },
  {
    title: 'Screenshot 4',
    thumbnail: '/img/screenshot2.webp',
  },
  {
    title: 'Screenshot 5',
    thumbnail: '/img/screenshot1.png',
  },
  {
    title: 'Screenshot 6',
    thumbnail: '/img/screenshot2.webp',
  },
  {
    title: 'Screenshot 7',
    thumbnail: '/img/screenshot1.png',
  },
  {
    title: 'Screenshot 8',
    thumbnail: '/img/screenshot2.webp',
  },
];

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 6);
  const secondRow = products.slice(2, 6);
  const thirdRow = products.slice(3, 6);
  const ref = React.useRef(null);

  const rotateX = 20;
  const opacity = 0.35;
  const rotateZ = 20;

  return (
    <div ref={ref} className="relative flex h-full  flex-col overflow-hidden antialiased md:h-full ">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[hsl(200,23%,8%)] "></div>

      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          opacity,
        }}
        className="absolute bottom-0 left-0 right-0 top-0 z-0">
        <motion.div className="mb-8 flex flex-row-reverse space-x-8 space-x-reverse">
          {firstRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="mb-8 flex  flex-row space-x-8 ">
          {secondRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-8 space-x-reverse">
          {thirdRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const t = useTranslations('home.cta');
  return (
    <div className="left-0 right-0 top-0 z-[10] mx-auto flex w-full  max-w-7xl flex-col items-center justify-center px-4 py-24 text-center md:py-40">
      <h2 className="text-gradient mb-2 translate-y-[40%] px-6 py-[3rem] text-center text-3xl font-medium leading-snug [transition:transform_1000ms_cubic-bezier(0.3,_1.17,_0.55,_0.99)_0s] md:px-32 md:text-[3.5rem] [.is-visible_&]:translate-y-0">
        {t('title1')} <br /> {t('title2')}
      </h2>
      <p className="text-md mx-auto mb-8 mt-[5rem] px-6 text-center font-normal text-foreground/90 md:w-[80%] md:px-32 md:text-xl ">
        {t('text')}
      </p>
      <div className="mt-14">
        <GradientLinkButton
          innerClassName="bg-background hover:bg-gray-800 active:bg-gray-800"
          size={'lg'}
          href={'/register'}>
          {t('button')}
        </GradientLinkButton>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
}: {
  product: {
    title: string;
    thumbnail: string;
  };
}) => {
  return (
    <motion.div key={product.title} className="group/product relative h-[16rem] w-[34rem] flex-shrink-0">
      <div className="block group-hover/product:shadow-2xl ">
        <Image
          src={product.thumbnail}
          height="700"
          width="1000"
          className="object-fit absolute inset-0 h-full w-full object-left-top"
          alt={product.title}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0"></div>
      <h2 className="absolute bottom-4 left-4 text-white  opacity-0">{product.title}</h2>
    </motion.div>
  );
};
