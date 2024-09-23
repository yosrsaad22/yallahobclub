'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from './language-toggle';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Link, usePathname } from '@/navigation';
import { LinearButton } from '../ui/linear-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Button, GradientLinkButton, LinkButton } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { IconChevronDown } from '@tabler/icons-react';

export const Navbar = () => {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = React.useState(false);

  const [windowWidth, setWindowWidth] = useState(0);
  const pathName = usePathname();

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth > 768) {
        setSheetOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  const t = useTranslations('home.navbar');

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center overflow-hidden border-b border-gray-400/[0.4] bg-background/20 p-3 backdrop-blur-md">
      <Link passHref href={'/'}>
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
      <div className="ml-6 flex flex-grow justify-start">
        <nav className="top-navigation-height hidden h-[calc(100vh_-_var(--navigation-height))] items-center gap-8 text-sm font-normal text-foreground md:h-auto lg:flex">
          <ul className="dark flex list-none items-center gap-8">
            <li>
              <Link passHref href="/" className="hover:text-turquoise">
                {t('home')}
              </Link>
            </li>
            <li>
              <Popover open={isPopupOpen} onOpenChange={setPopupOpen}>
                <PopoverTrigger
                  className={cn(
                    'flex flex-row items-center justify-center gap-x-1 bg-transparent px-0 data-[active]:bg-transparent data-[state=open]:bg-transparent data-[active]:text-turquoise data-[state=open]:text-turquoise hover:bg-transparent hover:text-turquoise focus:bg-transparent active:bg-transparent disabled:opacity-100',
                  )}>
                  {t('course.title')}
                  <IconChevronDown className="h-5 w-5" />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="z-[100] mt-6  w-full  min-w-[12rem] rounded-[0.375rem] border-gray-400/[0.4] bg-dark/20 p-0 text-sm  text-light backdrop-blur-md ">
                  <ul className="z-[100] grid w-max grid-cols-1 grid-rows-2 gap-4  p-6 ">
                    <li className="">
                      <Link
                        passHref
                        href="/#course"
                        onClick={() => {
                          setPopupOpen(false);
                        }}
                        className="hover:text-turquoise">
                        {t('course.overview')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        passHref
                        href="/free-course"
                        onClick={() => {
                          setPopupOpen(false);
                        }}
                        className="hover:text-turquoise">
                        {t('course.freecourse')}
                      </Link>
                      <LinearButton
                        className="pointer-events-none m-0 ml-2 animate-pulse p-1 text-xs text-orange"
                        variant="primary"
                        size="small">
                        <span>{t('new-feature')}</span>
                      </LinearButton>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </li>
            <li>
              <Link passHref href="/#platform" className="hover:text-turquoise">
                {t('platform')}
              </Link>
            </li>
            <li>
              <Link passHref href="/#pricing" className="hover:text-turquoise">
                {t('pricing')}
              </Link>
            </li>
            <li>
              <Link passHref href="/#testimonials" className="hover:text-turquoise">
                {t('testimonials')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-row items-center justify-center  gap-x-3">
        <div className="flex px-2">
          <LanguageToggle />
        </div>

        <Link
          passHref
          href={'/login'}
          className="relative hidden h-8 items-center justify-center overflow-hidden p-[1px] py-1 text-sm text-foreground hover:text-turquoise focus:outline-none active:text-turquoise md:inline-flex">
          {t('login')}
        </Link>
        <GradientLinkButton
          innerClassName="bg-[#222738] hover:bg-gray-700 active:bg-gray-700"
          size="sm"
          href={'/register'}>
          {t('register')}
        </GradientLinkButton>
        <Sheet open={isSheetOpen && window.innerWidth < 1024} onOpenChange={setSheetOpen}>
          <SheetTrigger className="flex lg:hidden" asChild>
            <Button variant={'outline'} className="bg-transparent" size={'icon'}>
              <MenuIcon className="h-[1.4rem] w-[1.4rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent side={'top'} className="z-[200] w-full border-none bg-[hsl(200,100%,5%)] text-white">
            <SheetHeader>
              <SheetTitle>
                <Link passHref href={'/'}>
                  <Image
                    src={'/img/logo.webp'}
                    width={150}
                    height={150}
                    loading="eager"
                    priority
                    alt="Ecomness logo"
                    className="mx-auto my-4 h-auto w-[120px]"
                  />
                </Link>
              </SheetTitle>
              <SheetDescription>
                <div className="flex flex-row justify-center  gap-x-4">
                  <div className="text-md justify-top  flex w-1/2 flex-col items-center gap-8 py-4 font-normal text-foreground">
                    <Link
                      passHref
                      href="/#platform"
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      className="hover:text-turquoise">
                      {t('platform')}
                    </Link>
                    <Accordion type="multiple" className="w-full text-center md:mx-0">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="ml-4 items-center justify-center gap-x-1 py-0 text-center hover:text-turquoise">
                          {t('course.title')}
                        </AccordionTrigger>
                        <AccordionContent className="py-8 text-center">
                          <Link
                            passHref
                            href="/#course"
                            onClick={() => {
                              setSheetOpen(false);
                            }}
                            className="hover:text-turquoise">
                            {t('course.overview')}
                          </Link>
                        </AccordionContent>
                        <AccordionContent className="pb-0 text-left">
                          <div className="flex flex-row items-center justify-center">
                            <Link
                              passHref
                              onClick={() => {
                                setSheetOpen(false);
                              }}
                              href="/free-course"
                              className={pathName === '/free-course' ? 'text-turquoise' : 'hover:text-turquoise'}>
                              {t('course.freecourse')}
                            </Link>
                            <LinearButton
                              className="pointer-events-none m-0 ml-2 animate-pulse p-1 text-xs text-orange"
                              variant="primary"
                              size="small">
                              <span>{t('new-feature')}</span>
                            </LinearButton>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Link
                      passHref
                      href="/#pricing"
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      className="hover:text-turquoise">
                      {t('pricing')}
                    </Link>
                  </div>
                  <div className="text-md justify-top flex w-1/2 flex-col items-center gap-8 py-4 font-normal text-foreground">
                    <Link
                      passHref
                      href="/#testimonials"
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      className="hover:text-turquoise">
                      {t('testimonials')}
                    </Link>

                    <Link
                      passHref
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      href="/register"
                      className="hover:text-turquoise">
                      {t('register')}
                    </Link>
                    <Link
                      passHref
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      href="/login"
                      className="hover:text-turquoise">
                      {t('login')}
                    </Link>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
