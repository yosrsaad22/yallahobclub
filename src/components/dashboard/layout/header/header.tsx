'use client';
import { cn } from '@/lib/utils';
import { MobileSidebar } from '../sidebar/mobile-sidebar';
import { UserNav } from './user-nav';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/use-sidebar';
import { useState } from 'react';
import { IconChevronsLeft, IconCoins } from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { roleOptions } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function Header() {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const user = useCurrentUser();

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Navigation */}
      <div className="h-18 flex items-center border-b bg-background">
        <nav className="flex h-16 w-full items-center justify-between px-3">
          <div className="flex items-center gap-x-3">
            <div className={cn('block lg:!hidden')}>
              <MobileSidebar />
            </div>
            <Button
              onClick={handleToggle}
              className={cn('hidden lg:flex', isMinimized ? 'rotate-180' : '')}
              variant={'outline'}
              size={'icon'}>
              <IconChevronsLeft className="h-[1.4rem] w-[1.4rem]" />
            </Button>
          </div>

          <div className="flex items-center gap-x-3">
            <UserNav />
          </div>
        </nav>
      </div>
    </div>
  );
}
