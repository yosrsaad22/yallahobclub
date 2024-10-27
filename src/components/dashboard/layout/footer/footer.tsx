'use client';

import { Globe } from '@/components/ui/globe';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Link, useRouter } from '@/navigation';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';

export default function Footer() {
  const tMarketplace = useTranslations('dashboard.marketplace');
  const tHome = useTranslations('home');
  const tSidebar = useTranslations('dashboard.sidebar');
  const role = useCurrentRole();

  return (
    <div className="relative  flex h-full flex-col items-start justify-start rounded-md border border-border xl:h-[20rem]  ">
      <div className="flex h-full w-full flex-col items-start justify-start gap-x-8 gap-y-8  overflow-y-hidden bg-background p-4 py-10 lg:flex-row lg:p-8 xl:gap-x-16 ">
        <div className=" flex-col space-y-5">
          <Link href="#" passHref>
            <Image
              src={'/img/logo.webp'}
              width={150}
              height={150}
              loading="eager"
              priority
              alt="Ecomness logo"
              className="h-auto w-[140px]"
            />
          </Link>
          <h2 className=" max-w-60 text-sm text-muted-foreground">{tHome('metadata.description')}</h2>
          <div className="flex flex-row items-center justify-start space-x-6 text-foreground">
            <a
              href="https://www.facebook.com/ecomness"
              type="button"
              title=""
              aria-label="Facebook"
              className="text-surface rounded-full bg-transparent  font-medium uppercase leading-normal hover:scale-110"
              data-twe-ripple-init>
              <span className="[&>svg]:h-5 [&>svg]:w-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512">
                  <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                </svg>
              </span>
            </a>

            <a
              href="https://www.instagram.com/ecomness/"
              type="button"
              aria-label="Instagram"
              className="text-surface rounded-full bg-transparent  font-medium uppercase leading-normal hover:scale-110"
              data-twe-ripple-init>
              <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </span>
            </a>

            <a
              href="https://www.tiktok.com/@ecomness"
              type="button"
              aria-label="tiktok"
              className="text-surface rounded-full bg-transparent  font-medium uppercase leading-normal hover:scale-110"
              data-twe-ripple-init>
              <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#c9de00"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M16.083 2h-4.083a1 1 0 0 0 -1 1v11.5a1.5 1.5 0 1 1 -2.519 -1.1l.12 -.1a1 1 0 0 0 .399 -.8v-4.326a1 1 0 0 0 -1.23 -.974a7.5 7.5 0 0 0 1.73 14.8l.243 -.005a7.5 7.5 0 0 0 7.257 -7.495v-2.7l.311 .153c1.122 .53 2.333 .868 3.59 .993a1 1 0 0 0 1.099 -.996v-4.033a1 1 0 0 0 -.834 -.986a5.005 5.005 0 0 1 -4.097 -4.096a1 1 0 0 0 -.986 -.835z"
                    strokeWidth="0"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <h2 className=" text-md pb-2 font-semibold text-foreground">{tSidebar('dashboard')}</h2>
          <Link className="text-sm text-muted-foreground hover:text-primary" href="/dashboard" passHref>
            {tMarketplace('home')}
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-primary"
            href={`/dashboard/${role?.toLowerCase()}/products`}
            passHref>
            {tSidebar('products')}
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-primary"
            href={`/dashboard/${role?.toLowerCase()}/orders`}
            passHref>
            {tSidebar('orders')}
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-primary"
            href={`/dashboard/${role?.toLowerCase()}/transactions`}
            passHref>
            {tSidebar('transactions')}
          </Link>
        </div>
        <div className="flex flex-col space-y-3">
          <h2 className=" text-md pb-2 font-semibold text-foreground">Marketplace</h2>
          <Link
            className="text-sm text-muted-foreground hover:text-primary"
            href="/dashboard/marketplace/all-products"
            passHref>
            {tMarketplace('all-products')}
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-primary"
            href="/dashboard/marketplace/all-products?featured=true"
            passHref>
            {tMarketplace('featured')}
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-primary"
            href="/dashboard/marketplace/all-products"
            passHref>
            {tMarketplace('new-arrivals')}
          </Link>
        </div>
        <div className="flex flex-col space-y-3">
          <h2 className=" text-md pb-2  font-semibold text-foreground">Support</h2>
          <p className="flex flex-row  items-center gap-x-2 text-sm font-normal text-muted-foreground">
            {' '}
            <IconMail className="h-5 w-5" /> support@ecomness.com{' '}
          </p>
          <p className="flex flex-row items-center gap-x-2 text-sm font-normal text-muted-foreground">
            {' '}
            <IconPhone className="h-5 w-5" /> (+216) 24 002 024
          </p>
        </div>
      </div>
      <div className="z-[20] flex h-16 w-full flex-row items-center justify-center rounded-b-md border-b border-border bg-primary text-sm text-white">
        © 2024 Copyright ECOMNESS GROUP
      </div>
      <Globe className="absolute right-0 top-0 hidden md:flex" />
    </div>
  );
}
