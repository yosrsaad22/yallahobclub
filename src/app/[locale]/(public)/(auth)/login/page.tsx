import { LoginForm } from '@/components/auth/login-form';
import StarsCanvas from '@/components/home/hero/stars-background';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'login' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default function Login() {
  const t = useTranslations('login');
  return (
    <>
      <StarsCanvas props="fixed" />
      <div className="mx-auto -mt-[4.1rem] flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-16">
        <div className="mx-12 translate-y-[-1rem] animate-fade-in opacity-0  [--animation-delay:400ms]">
          <div className="flex flex-col gap-y-4 py-4 text-center">
            <h1 className="text-gradient mx-2 translate-y-[-1rem] animate-fade-in py-2 text-3xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:text-[3rem]">
              {t('form-title')}
            </h1>
            <p className="text-md mx-auto mb-4 max-w-md text-muted-foreground">{t('text')}</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
