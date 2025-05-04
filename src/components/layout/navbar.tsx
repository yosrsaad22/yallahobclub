'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  const [isSheetOpen, setSheetOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(0);

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

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-[80px] items-center justify-center overflow-hidden border-b border-gray-400/[0.4] bg-white p-4 ">
      <Link passHref href={'/'}>
        <Image
          src={'/img/logo.jpg'}
          width={150}
          height={150}
          loading="eager"
          priority
          alt="Yalla hob logo"
          className="h-auto w-[120px]"
        />
      </Link>
      <div className="ml-6 flex flex-grow justify-start">
      <nav className="top-navigation-height hidden h-[calc(100vh_-_var(--navigation-height))] items-center gap-8 text-sm font-normal text-foreground md:h-auto lg:flex">
  <ul className="dark flex list-none items-center gap-8">
    <li>
      <Link passHref href="/" className="hover:text-red-600">
        Accueil
      </Link>
    </li>
    <li><a href="#qui-sommes-nous" className="hover:text-red-600">Qui sommes-nous</a></li>
    <li><a href="#nos-produits" className="hover:text-red-600">Nos Produits</a></li>
    <li><a href="#contact" className="hover:text-red-600">Contact</a></li>
    {/* Liens nécessitant une connexion */}
    <li>
    <Link passHref href="/vie-de-couple" className="hover:text-red-600">
  Vie de Couple
</Link>
    </li>
    <li>
      <Link passHref href="/login" className="hover:text-red-600">
        Vie de famille
      </Link>
    </li>
    <li>
      <Link passHref href="/login" className="hover:text-red-600">
        Profil
      </Link>
    </li>
  </ul>
</nav>

      </div>
      <div className="flex flex-row items-center justify-center  gap-x-3">
        <Link
          passHref
          href={'/login'}
          className="relative hidden h-8 items-center justify-center overflow-hidden p-[1px] py-1 text-sm text-foreground hover:text-red-600 focus:outline-none active:text-red-500 md:inline-flex">
          Se Connecter
        </Link>
        <Link
          passHref
          href={'/register'}
          className="relative hidden h-8 items-center justify-center overflow-hidden p-[1px] py-1 text-sm text-foreground hover:text-red-600 focus:outline-none active:text-red-500 md:inline-flex">
          S'inscrire
        </Link>
        <Sheet open={isSheetOpen && window.innerWidth < 1024} onOpenChange={setSheetOpen}>
          <SheetTrigger className="flex lg:hidden" asChild>
            <Button variant={'outline'} className="bg-transparent" size={'icon'}>
              <MenuIcon className="h-[1.4rem] w-[1.4rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent side={'top'} className="z-[200] w-full border-none bg-[hsl(197,12%,12%)] text-white">
            <SheetHeader>
              <SheetTitle>
                <Link passHref href={'/'}>
                  <Image
                    src={'/img/logo.jpg'}
                    width={150}
                    height={150}
                    loading="eager"
                    priority
                    alt="Yalla hob logo"
                    className="mx-auto my-4 h-auto w-[120px]"
                  />
                </Link>
              </SheetTitle>
              <SheetDescription>
                <div className="flex flex-row justify-center  gap-x-4">
                  <div className="text-md justify-top  flex w-1/2 flex-col items-center gap-8 py-4 font-normal text-foreground">
                    <Link
                      passHref
                      href="/"
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      className="hover:text-red-500">
                      Accueil
                    </Link>
                  </div>
                  <div className="text-md justify-top flex w-1/2 flex-col items-center gap-8 py-4 font-normal text-foreground">
                    <Link
                      passHref
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      href="/register"
                      className="hover:text-red-500">
                      S'inscrire
                    </Link>
                    <Link
                      passHref
                      onClick={() => {
                        setSheetOpen(false);
                      }}
                      href="/login"
                      className="hover:text-red-500">
                      Se Connecter
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
