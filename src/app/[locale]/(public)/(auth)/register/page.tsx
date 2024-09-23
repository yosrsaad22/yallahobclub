import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import StarsCanvas from '@/components/home/hero/stars-background';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'register' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default function Register() {
  const t = useTranslations('register');
  return (
    <>
      <StarsCanvas props="fixed" />
      <div className="mx-auto my-8 flex min-h-screen w-full  max-w-6xl flex-col  md:py-16">
        <div className="mx-12 translate-y-[-1rem] animate-fade-in opacity-0  [--animation-delay:400ms]">
          <div className="flex flex-col gap-y-4 pb-4 text-center">
            <h1 className="text-gradient mx-2 translate-y-[-1rem] animate-fade-in py-2 text-3xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:text-[3rem]">
              {t('form-title')}
            </h1>
            <p className="text-md mx-auto mb-4 max-w-md text-muted-foreground">{t('form-text')}</p>
          </div>
          <RegisterForm />
          <p className="px-8 py-4 text-center text-sm text-muted-foreground">
            {t('consent')}{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              {t('terms')}
            </Link>{' '}
            {t('consent2')}{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              {t('policy')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
