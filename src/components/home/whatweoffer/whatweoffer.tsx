import { useTranslations } from 'next-intl';
import { Features, MainFeature } from '../features';

export const WhatWeOffer = () => {
  const t = useTranslations('home.whatweoffer');
  return (
    <section id="whatweoffer" className="-mt-[25rem] md:-mt-[18rem]">
      <Features color="129, 210, 237" colorDark="53, 92, 105" showSparkles={false}>
        <MainFeature badge={t('badge')} title=<>{t('title')} </> text={t('text')}></MainFeature>
      </Features>
    </section>
  );
};
