'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, MotionValue, useVelocity, useSpring } from 'framer-motion';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import Ripple from './ripple';
import { Link } from '@/navigation';

export const PerspectiveContainer = ({
  titleComponent,
  children,
}: {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Adjust scale dimensions for mobile
  const scaleDimensions = () => (isMobile ? [0.7, 0.8] : [0.65, 0.6]);

  // Get scroll velocity to control damping
  const scrollVelocity = useVelocity(scrollYProgress);

  // Apply damping to transformations
  const damping = 0.2; // Adjust for smoother/slower response
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [40, 0]), {
    damping: 15 - scrollVelocity.get() * damping,
    stiffness: 70,
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], scaleDimensions()), {
    damping: 15 - scrollVelocity.get() * damping,
    stiffness: 70,
  });
  const translate = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), {
    damping: 15 - scrollVelocity.get() * damping,
    stiffness: 70,
  });

  return (
    <div
      className="relative -mb-24 -mt-[15rem] flex h-[60rem] items-center justify-center p-2 md:-mt-[3rem] md:h-[50rem]"
      ref={containerRef}>
      <div
        className="relative w-full py-10 md:py-24"
        style={{
          perspective: '1000px',
        }}>
        {titleComponent && <Header translate={translate} titleComponent={titleComponent} />}
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div mx-auto max-w-5xl text-center">
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className="mx-auto -mt-10 h-[16rem] w-full rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:-mt-16 md:h-1/3 md:max-w-5xl md:p-4">
      <div className=" h-full w-full">{children}</div>
      <div className="absolute inset-0 m-2 flex max-w-5xl items-center justify-center rounded-2xl bg-[rgba(28,27,27,0.16)] md:rounded-xl">
        <Ripple />
        <Link passHref aria-label="Get the dropshipping course" href={'/free-course'}>
          <div className="relative flex h-16 overflow-hidden rounded-full border-2 border-primary p-[5px] focus:outline-none md:h-32">
            <IconPlayerPlayFilled className="text-md z-[100] flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#222222] p-2 font-semibold text-primary md:p-6 md:text-lg" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};
