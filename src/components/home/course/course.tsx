import { FeatureGrid, Features, MainFeature } from '../features';
import Image from 'next/image';
import { PerspectiveContainer } from './perspective-container';
import { useTranslations } from 'next-intl';
export const Course = () => {
  const t = useTranslations('home.course');
  return (
    <section id="course" className="mb-16">
      <Features color="129, 210, 237" colorDark="53, 92, 105" showSparkles={false}>
        <MainFeature
          showButton
          buttonText={t('button')}
          buttonLink="/full-course"
          badge={t('badge')}
          title={
            <>
              {t('title1')}
              <br />
              {t('title2')}
            </>
          }
          text={t('text')}
        />

        <div className="course-radial-gradient flex w-[100%] flex-row flex-wrap justify-center">
          <FeatureGrid></FeatureGrid>

          <PerspectiveContainer
            titleComponent={
              <h2 className="text-gradient px-8 pt-[3rem] text-center text-3xl font-medium leading-snug md:px-32 md:text-[3rem]">
                {t('title3')} <br /> {t('title4')}
              </h2>
            }>
            <Image
              src={'/img/course.webp'}
              alt="course"
              height={720}
              width={1400}
              className="object-fit mx-auto h-full  rounded-2xl"
              draggable={false}
            />
          </PerspectiveContainer>
        </div>
      </Features>
    </section>
  );
};
