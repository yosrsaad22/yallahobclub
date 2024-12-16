import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';

export function FAQ() {
  const t = useTranslations('home.faq');
  return (
    <section className="builder-radial-gradient relative  flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-[hsl(200,23%,8%)] py-24 md:shadow-xl">
      <div className="mx-6 w-3/4 pb-0">
        <h2 className="text-gradient translate-y-[40%] text-center text-4xl font-medium leading-snug [transition:transform_1000ms_cubic-bezier(0.3,_1.17,_0.55,_0.99)_0s] md:px-32 md:text-[3.5rem] [.is-visible_&]:translate-y-0">
          {t('title')}
        </h2>
        <p className="text-md mx-auto mb-16 mt-[5rem] text-center font-normal text-foreground/90 md:w-[80%] md:px-32 md:text-xl ">
          {t('text')}
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full px-8 text-left md:mx-0 md:w-[70%] ">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">{t('question1')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer1')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">{t('question2')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer2')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">{t('question3')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer3')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">{t('question4')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer4')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left">{t('question5')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer5')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-left">{t('question6')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer6')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger className="text-left">{t('question7')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer7')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger className="text-left">{t('question8')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer8')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger className="text-left">{t('question9')}</AccordionTrigger>
          <AccordionContent className="text-left">{t('answer9')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
