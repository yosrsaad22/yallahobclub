import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { backgroundGradientVariants } from '@/lib/framer-variants';

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  return (
    <div className={cn('group relative', containerClassName)}>
      <motion.div
        variants={animate ? backgroundGradientVariants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? '400% 400%' : undefined,
        }}
        className={cn(
          'absolute inset-0 z-[1] rounded-3xl opacity-60 blur-xl transition  duration-500 will-change-transform group-hover:opacity-100',
          ' bg-[radial-gradient(circle_farthest-side_at_0_100%,#4f7ba1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#4f7ba1,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#4f7ba1,transparent),radial-gradient(circle_farthest-side_at_0_0,#4f7ba1,#141316)]',
        )}
      />
      <motion.div
        variants={animate ? backgroundGradientVariants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? '400% 400%' : undefined,
        }}
        className={cn(
          'absolute inset-0 z-[1] rounded-3xl will-change-transform',
          'bg-[radial-gradient(circle_farthest-side_at_0_100%,#4f7ba1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#4f7ba1,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#4f7ba1,transparent),radial-gradient(circle_farthest-side_at_0_0,#4f7ba1,#4f7ba1)]',
        )}
      />

      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
};
