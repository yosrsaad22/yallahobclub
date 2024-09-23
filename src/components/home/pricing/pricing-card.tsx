'use client';
import React from 'react';
import { CardContainer, CardBody, CardItem } from './3d-card';
import { cn } from '@/lib/utils';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { BackgroundGradient } from './background-gradient';
import { GradientLinkButton } from '@/components/ui/button';

export const PricingCard = ({
  className,
  packName,
  price,
  payOnceText,
  description,
  buttonText,
  href,
  features,
}: {
  className?: string;
  packName: string;
  price?: string;
  payOnceText?: string;
  description: string;
  buttonText: string;
  href: string;
  features: string[];
}) => {
  return (
    <CardContainer className="inter-var  ">
      <CardBody
        className={cn(
          'group/card  relative flex h-auto w-full flex-col  rounded-[1.2rem] border bg-[#172637] p-4 md:!w-[380px] md:p-6',
          className,
        )}>
        <CardItem translateZ="50" className="pt-4 text-xl font-bold text-primary ">
          PACK {packName}
          {price && (
            <div>
              <h2 className="text-gradient mx-auto text-5xl font-semibold">{price}</h2>
              <p className="mx-auto text-sm font-medium italic text-gray-400">{payOnceText}</p>
            </div>
          )}
        </CardItem>
        <CardItem translateZ="60" className=" max-w-sm  text-sm text-neutral-300">
          <p className="pb-8">{description}</p>
          <ul className="flex flex-col items-start gap-3">
            {features.map((feature, index) => (
              <li key={index} className="flex w-full flex-row items-start justify-start">
                <div className="mr-1 h-8 min-w-10">
                  <IconCircleCheckFilled className="w-8 text-primary"></IconCircleCheckFilled>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </CardItem>
        <div className="mx-auto">
          <GradientLinkButton size={'lg'} innerClassName="bg-[#172637]" href={href}>
            {buttonText}
          </GradientLinkButton>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export const GradientPricingCard = ({
  className,
  packName,
  price,
  payOnceText,
  description,
  note,
  buttonText,
  href,
  features,
}: {
  className?: string;
  packName: string;
  price?: string;
  payOnceText?: string;
  description: string;
  note?: string;
  buttonText: string;
  href: string;
  features: string[];
}) => {
  return (
    <BackgroundGradient>
      <CardContainer className="inter-var  ">
        <CardBody
          className={cn(
            'group/card  relative flex h-auto w-full flex-col  rounded-[1.2rem] border bg-[#172637] p-4 md:!w-[380px] md:p-6',
            className,
          )}>
          <CardItem translateZ="50" className="pt-4 text-xl font-bold text-primary ">
            PACK {packName}
            {price && (
              <div>
                <h2 className="text-gradient mx-auto text-5xl font-semibold">{price}</h2>
                <p className="mx-auto text-sm font-medium italic text-gray-400">{payOnceText}</p>
              </div>
            )}
          </CardItem>
          <CardItem translateZ="60" className=" max-w-sm  text-sm text-neutral-300">
            <p className="animate-pulse pb-2 font-bold">{note}</p>
            <p className="pb-8">{description}</p>
            <ul className="flex flex-col items-start gap-3">
              {features.map((feature, index) => (
                <li key={index} className="flex w-full flex-row items-start justify-start">
                  <div className="mr-1 h-8 min-w-10">
                    <IconCircleCheckFilled className="w-8 text-primary"></IconCircleCheckFilled>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </CardItem>
          <div className="mx-auto">
            <GradientLinkButton size={'lg'} variant={'default'} innerClassName="bg-[#172637]" href={href}>
              {buttonText}
            </GradientLinkButton>
          </div>
        </CardBody>
      </CardContainer>
    </BackgroundGradient>
  );
};
