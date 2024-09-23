import { useTranslations } from 'next-intl';
import { BorderBeam } from './border-beam';
import Image from 'next/image';

const WebBuilder: React.FC = () => {
  const t = useTranslations('home.platform');
  return (
    <div className="flex h-full items-center justify-center overflow-hidden">
      <div className="builder-radial-gradient mx-6 w-3/4 pb-0">
        <h2 className="text-gradient translate-y-[40%] px-8 pt-[3rem] text-center text-4xl font-medium leading-snug [transition:transform_1000ms_cubic-bezier(0.3,_1.17,_0.55,_0.99)_0s] md:px-32 md:text-[3.5rem] [.is-visible_&]:translate-y-0">
          {t('title2')}
        </h2>
        <p className="text-md mx-auto mb-4 mt-[5rem] px-8 text-center font-normal text-foreground/90 md:w-[80%] md:px-32 md:text-xl ">
          {t('text2')}
        </p>
        <div className="flex justify-center">
          <div className="relative mt-8">
            <Image
              src="/img/webuilder.webp"
              alt="Web builder image"
              width={700}
              height={900}
              className="mt-16 block w-[700px] rounded-xl border object-contain shadow-lg"
            />
            <BorderBeam
              colorFrom="hsl(182,63%,45%)"
              borderWidth={3}
              colorTo="rgb(50, 80, 105)"
              size={290}
              className="mt-16"
              duration={12}
              delay={9}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebBuilder;
