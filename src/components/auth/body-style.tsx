'use client';

import { useEffect } from 'react';

export function BodyStyle({ backgroundColor }: { backgroundColor: string }) {
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;

    return () => {
      document.body.style.backgroundColor = backgroundColor;
    };
  }, [backgroundColor]);

  return null;
}
