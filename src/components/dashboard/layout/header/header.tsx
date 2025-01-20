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
import { IconBrandWhatsapp, IconChevronsLeft, IconCoins, IconShoppingCart } from '@tabler/icons-react';
import { LanguageToggle } from './language-toggle';
import { useCurrentUser } from '@/hooks/use-current-user';
import { roleOptions } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Header() {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const user = useCurrentUser();
  const t = useTranslations('dashboard.text');

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex h-7 w-full items-center justify-center overflow-hidden bg-gradient-to-r from-secondary to-primary/80 text-sm tracking-wider text-white">
        <Link className="flex flex-row items-center " href="https://wa.me/21624002024">
          <IconBrandWhatsapp className="mr-1 h-5 w-5" />
          {t('annoucement')}
        </Link>
      </div>
      <div className="flex h-16  items-center justify-between border-b bg-background">
        <nav className="flex h-16 w-full items-center justify-between overflow-hidden px-3">
          <div className="flex items-center gap-x-3">
            <div className={cn('block lg:!hidden')}>
              <MobileSidebar />
            </div>
            <Button
              onClick={handleToggle}
              className={cn('hidden lg:flex', isMinimized ? 'rotate-180' : '')}
              variant={'outline'}
              size={'icon'}>
              <IconChevronsLeft className=" h-[1.4rem] w-[1.4rem]" />
            </Button>
            <Link href="/dashboard" passHref>
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
            {(user?.role === roleOptions.SELLER || user?.role === roleOptions.SUPPLIER) && (
              <div className="hidden flex-row gap-x-4 rounded-md border border-muted p-2 lg:flex">
                <IconCoins />
                <p className="font-semibold">{user?.balance} TND</p>
              </div>
            )}
            <LanguageToggle />
            <NotificationDropdown />
            <UserNav />
          </div>
        </nav>
      </div>
    </div>
  );
}
