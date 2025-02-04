import { currentPack } from '@/lib/auth';
import { packOptions } from '@/lib/constants';
import { PayWallCard } from '../dashboard/cards/pay-wall-card';
import { getTranslations } from 'next-intl/server';

interface PackGateProps {
  children: React.ReactNode;
  allowedPacks: packOptions[];
}

export const PackGate = async ({ children, allowedPacks }: PackGateProps) => {
  const pack = await currentPack();
  const t = await getTranslations('dashboard.paywall');
  if (!allowedPacks.includes(pack)) {
    return (
      <div className="relative">
        <div className="absolute inset-0 z-[20] h-full backdrop-blur-md">
          <PayWallCard title={t('title')} text={t('course-text')} buttonText={t('get-course')} />
        </div>
        {children}
      </div>
    );
  }
  return <>{children}</>;
};
