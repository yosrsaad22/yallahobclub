'use client';

import React, { CSSProperties } from 'react';
const Ripple = React.memo(() => {
  const MAIN_CIRCLE_SIZE = 4;
  const MAIN_CIRCLE_OPACITY = 0.4;

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const NUM_CIRCLES = () => {
    return isMobile ? 5 : 7;
  };

  return (
    <div className="absolute left-1/2 top-1/2 h-full w-full overflow-visible">
      {Array.from({ length: NUM_CIRCLES() }, (_, i) => (
        <div
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-black`}
          style={
            {
              width: MAIN_CIRCLE_SIZE + i * 30,
              height: MAIN_CIRCLE_SIZE + i * 30,
              opacity: MAIN_CIRCLE_OPACITY - i * 0.03,
              animationDelay: `${i * 0.06}s`,
            } as CSSProperties
          }></div>
      ))}
    </div>
  );
});
Ripple.displayName = 'Ripple';
export default Ripple;
