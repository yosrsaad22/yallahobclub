import { useTranslations } from 'next-intl';
import { Features, MainFeature } from '../features';

export const WhatWeOffer = () => {
  const t = useTranslations('home.whatweoffer');
  return (
    <section id="whatweoffer" className="-mt-[25rem] md:-mt-[18rem]">
      <Features color="166, 216, 245" colorDark="30, 66, 87" showSparkles={false}>
        <MainFeature badge={t('badge')} title=<>{t('title')} </> text={t('text')}></MainFeature>
      </Features>
    </section>
  );
};
