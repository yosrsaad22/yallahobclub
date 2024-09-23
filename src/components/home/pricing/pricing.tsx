'use client';

import { GradientPricingCard, PricingCard } from './pricing-card';
import { Features, MainFeature } from '../features';
import { useTranslations } from 'next-intl';

export const Pricing = () => {
  const t = useTranslations('home.pricing');
  return (
    <section id="pricing" className="relative h-full w-full">
      <Features color="0,225,244" colorDark="50, 80, 105" showSparkles>
        <MainFeature badge={t('badge')} title={<>{t('title')}</>} text={t('text')} />

        <div className="flex flex-col  flex-wrap items-center justify-center gap-12 px-12 pt-8 md:flex-row md:px-32">
          <PricingCard
            className="m-1 space-y-8"
            packName="DAMREJ"
            href="/register"
            price="0 DT"
            payOnceText={t('free')}
            description={t('damrej.description')}
            features={[t('damrej.feature1'), t('damrej.feature2'), t('damrej.feature3'), t('damrej.feature4')]}
            buttonText={t('damrej.button')}
          />

          <GradientPricingCard
            className="m-1 space-y-8"
            packName="3JEJA"
            price="750 DT"
            href="/register"
            description={t('3jeja.description')}
            features={[
              t('3jeja.feature1'),
              t('3jeja.feature2'),
              t('3jeja.feature3'),
              t('3jeja.feature4'),
              t('3jeja.feature5'),
              t('3jeja.feature6'),
              t('3jeja.feature7'),
            ]}
            buttonText={t('3jeja.button')}
          />
          <PricingCard
            className="m-1 space-y-8"
            href="/register"
            packName="MACHROU3"
            price="1500 DT"
            payOnceText={t('pay-once')}
            description={t('machrou3.description')}
            features={[t('machrou3.feature1'), t('machrou3.feature2'), t('machrou3.feature3'), t('machrou3.feature4')]}
            buttonText={t('machrou3.button')}
          />
        </div>
      </Features>
    </section>
  );
};
