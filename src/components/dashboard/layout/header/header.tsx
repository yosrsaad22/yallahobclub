'use client';
import { cn } from '@/lib/utils';
import { MobileSidebar } from '../sidebar/mobile-sidebar';
import { UserNav } from './user-nav';
import { Link } from '@/navigation';
import Image from 'next/image';
import NotificationDropdown from './notification';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/use-sidebar';
import { useState } from 'react';
import { IconChevronsLeft } from '@tabler/icons-react';
import { LanguageToggle } from './language-toggle';

export default function Header() {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <div className=" fixed left-0 right-0 top-0 z-20 w-full overflow-y-hidden  border-b bg-background">
      <nav className="flex h-16 items-center justify-between overflow-hidden px-3">
        <div className="flex items-center gap-x-3">
          <div className={cn('block lg:!hidden')}>
            <MobileSidebar />
          </div>
          <Button
            onClick={handleToggle}
            className={cn('hidden md:flex', isMinimized ? 'rotate-180' : '')}
            variant={'outline'}
            size={'icon'}>
            <IconChevronsLeft className=" h-[1.4rem] w-[1.4rem]" />
          </Button>
          <Link href="#" passHref>
            <Image
              src={'/img/logo.webp'}
              width={150}
              height={150}
              loading="eager"
              priority
              alt="Ecomness logo"
              className="h-auto w-[120px]"
            />
          </Link>
        </div>

        <div className="relative flex items-center gap-x-3">
          <LanguageToggle />
          <NotificationDropdown />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
