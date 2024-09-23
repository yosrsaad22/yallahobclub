import { useTranslations } from 'next-intl';
import { AdexLogo } from '../../logos/adex';
import { AisecLogo } from '../../logos/aisec';
import { AllakniLogo } from '../../logos/allakni';
import { IeeLogo } from '../../logos/ieee';
import { ShopifyLogo } from '../../logos/shopify';
import { VercelLogo } from '../../logos/vercel';

export const Partners = () => {
  const t = useTranslations('home.partners');
  return (
    <div className="flex flex-col p-6 md:px-24">
      <p className="mb-12 pt-12 text-center text-lg  text-foreground/90 md:text-xl">
        <span className="">{t('text1')}</span>
        <br className="" />
        {t('text2')}
      </p>
      <div className="flex flex-wrap justify-around gap-x-6 gap-y-8 [&_svg]:max-w-[16rem] [&_svg]:basis-[calc(50%-12px)] md:[&_svg]:basis-[calc(16.66%-20px)]">
        <AdexLogo />
        <VercelLogo />
        <IeeLogo />
        <AllakniLogo />
        <AisecLogo />
        <ShopifyLogo />
      </div>
    </div>
  );
};
