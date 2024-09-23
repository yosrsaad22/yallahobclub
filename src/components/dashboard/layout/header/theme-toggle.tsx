'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { IconLoader2, IconMoon, IconSun } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type CompProps = {};

export default function ThemeToggle({}: CompProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is resolved before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder icon (either sun or moon) while waiting for the theme to be resolved
    return (
      <Button variant="outline" size="icon" disabled>
        <IconLoader2 className="h-[1.4rem] w-[1.4rem] animate-spin" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        if (resolvedTheme === 'dark') {
          setTheme('light');
        } else {
          setTheme('dark');
        }
      }}>
      <IconSun className={cn(resolvedTheme === 'dark' ? 'hidden' : 'flex', 'h-[1.4rem] w-[1.4rem]')} />
      <IconMoon className={cn(resolvedTheme === 'dark' ? 'flex' : 'hidden', 'h-[1.4rem] w-[1.4rem]')} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
