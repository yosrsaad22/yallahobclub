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
import { IconHeadset, IconTruckDelivery, IconSchool, IconChevronsLeft, IconCoins } from '@tabler/icons-react';
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

  const linkItems = [
    { href: 'https://wa.me/21624002024', icon: <IconHeadset className="mr-2 h-5 w-5" />, text: t('tech-support') },
    {
      href: 'https://wa.me/21692541890',
      icon: <IconTruckDelivery className="mr-2 h-5 w-5" />,
      text: t('logistic-support'),
    },
    { href: 'https://wa.me/21623032044', icon: <IconSchool className="mr-2 h-5 w-5" />, text: t('course-support') },
  ];

  // Duplicate links to create a seamless loop

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Scrolling Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-secondary to-primary/80 py-1 text-sm tracking-wider text-white">
        <div className="relative flex h-5 w-full overflow-hidden">
          <motion.div
            className="absolute top-0 flex w-max gap-8 whitespace-nowrap"
            animate={{ x: ['150%', '-100%'] }} // Moves infinitely left
            transition={{
              duration: 35, // Adjust speed here
              ease: 'linear', // Ensures constant speed
              repeat: Infinity,
            }}>
            {linkItems.map((link, index) => (
              <Link key={index} className="flex shrink-0 flex-row items-center justify-center px-4" href={link.href}>
                {link.icon}
                {link.text}
              </Link>
            ))}
          </motion.div>
          <motion.div
            className="absolute top-0 flex w-max gap-8 whitespace-nowrap"
            animate={{ x: ['150%', '-100%'] }} // Moves infinitely left
            transition={{
              delay: 14.5,
              duration: 35, // Adjust speed here
              ease: 'linear', // Ensures constant speed
              repeat: Infinity,
            }}>
            {linkItems.map((link, index) => (
              <Link key={index} className="flex shrink-0 flex-row items-center justify-center px-4" href={link.href}>
                {link.icon}
                {link.text}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Header Navigation */}
      <div className="flex h-16 items-center border-b bg-background">
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

          <div className="flex items-center gap-x-3">
            {(user?.role === roleOptions.SELLER || user?.role === roleOptions.SUPPLIER) && (
              <div className="hidden flex-row gap-x-4 rounded-md border border-muted p-2 lg:flex">
                <IconCoins />
                <p className="font-semibold">{user?.balance.toFixed(2)} TND</p>
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
