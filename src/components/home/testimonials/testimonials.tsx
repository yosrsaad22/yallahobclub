import { cn } from '@/lib/utils';
import Marquee from '@/components/ui/marquee';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const Testimonials = () => {
  const t = useTranslations('home.testimonials');
  const users = useTranslations('home.testimonials.users');
  const firstRowKeys = ['user1', 'user2', 'user3'] as const;
  const secondRowkeys = ['user4', 'user5', 'user6'] as const;

  return (
    <section id="testimonials">
      <div className=" builder-radial-gradient relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg  py-24">
        <div className="mx-6 w-3/4 pb-0">
          <h2 className="text-gradient translate-y-[40%] text-center text-4xl font-medium leading-snug [transition:transform_1000ms_cubic-bezier(0.3,_1.17,_0.55,_0.99)_0s] md:px-32 md:text-[3.5rem] [.is-visible_&]:translate-y-0">
            {t('title')}
          </h2>
          <p className="text-md mx-auto mb-16 mt-[5rem] text-center font-normal text-foreground/90 md:w-[80%] md:px-32 md:text-xl ">
            {t('text')}
          </p>
        </div>
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRowKeys.map((key) => (
            <figure
              key={key}
              className={cn(
                'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
                'border-gray-50/[.1] bg-gray-50/[.10] hover:bg-gray-50/[.15]',
              )}>
              <div className="flex flex-row items-center gap-2">
                <Image className="rounded-full" width="32" height="32" alt="" src={users(`${key}.img`)} />
                <div className="flex flex-col">
                  <figcaption className="text-white-90 text-sm font-medium">{users(`${key}.name`)}</figcaption>
                  <p className="text-xs font-medium text-white/40">{users(`${key}.job`)}</p>
                </div>
              </div>
              <blockquote className="text-white-90 mt-2 text-sm">{users(`${key}.text`)}</blockquote>
            </figure>
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRowkeys.map((key) => (
            <figure
              key={key}
              className={cn(
                'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
                'border-gray-50/[.1] bg-gray-50/[.10] hover:bg-gray-50/[.15]',
              )}>
              <div className="flex flex-row items-center gap-2">
                <Image className="rounded-full" width="32" height="32" alt="" src={users(`${key}.img`)} />
                <div className="flex flex-col">
                  <figcaption className="text-white-90 text-sm font-medium">{users(`${key}.name`)}</figcaption>
                  <p className="text-xs font-medium text-white/40">{users(`${key}.job`)}</p>
                </div>
              </div>
              <blockquote className="text-white-90 mt-2 text-sm">{users(`${key}.text`)}</blockquote>
            </figure>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
