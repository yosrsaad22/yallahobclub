import { currentRole } from '@/lib/auth';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function Unauthorized() {
  const t = await getTranslations('unauthorized');
  const role = await currentRole();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-page">
      <h1 className="text-9xl font-extrabold tracking-widest text-foreground">401</h1>
      <div className="absolute mb-24 rotate-12 rounded bg-[#e23670] px-2 text-sm text-white">{t('title')}</div>
      <Link
        className="text-md mt-16 inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[6px] bg-[#2ab6bb] px-8 py-2 font-semibold text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        href={role ? `/${role.toLowerCase()}/dashboard` : `/`}>
        {t('button')}
      </Link>
    </div>
  );
}
