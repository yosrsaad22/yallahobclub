'use client';
import { useTranslations } from 'next-intl';
import { Features, MainFeature } from '../features';
import { PlatformBento } from './platform-bento';
import StatsCounter from './stats-counter';

export const Platform = () => {
  const t = useTranslations('home.platform');
  return (
    <section id="platform" className="-mt-[15rem] md:-mt-[6rem]">
      <Features color="0,225,244" colorDark="50, 80, 105" showSparkles={false}>
        <MainFeature
          badge={t('badge')}
          title={<>{t('title')}</>}
          text={t('text')}
          buttonLink="#pricing"
          buttonText={t('button')}
          showButton
        />
        <PlatformBento />
      </Features>
      <StatsCounter />
    </section>
  );
};
