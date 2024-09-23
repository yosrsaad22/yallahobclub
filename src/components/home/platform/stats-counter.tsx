import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const StatsCounter = () => {
  const [productInView, setProductInVIew] = useState(false);
  const [revenueInView, setRevenueInView] = useState(false);
  const [supplierInView, setSupplierInView] = useState(false);

  const { ref: productRef, inView: productObserver } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const { ref: revenueRef, inView: revenueObserver } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const { ref: supplierRef, inView: supplierObserver } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (productObserver !== undefined) setProductInVIew(productObserver);
  }, [productObserver]);

  useEffect(() => {
    if (revenueObserver !== undefined) setRevenueInView(revenueObserver);
  }, [revenueObserver]);

  useEffect(() => {
    if (supplierObserver !== undefined) setSupplierInView(supplierObserver);
  }, [supplierObserver]);

  useEffect(() => {
    if (productInView) animateCountUp('starsCount', 50, '+', 1000);
    if (revenueInView) animateCountUp('downloadsCount', 100000, '+', 1000);
    if (supplierInView) animateCountUp('sponsorsCount', 5, '+', 1000);
  }, [productInView, revenueInView, supplierInView]);

  function animateCountUp(elementId: string, count: number, suffix: string, duration: number) {
    let currentCount = 0;
    const increment = Math.ceil(count / (duration / 10));
    const element = document.getElementById(elementId);

    const interval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= count) {
        clearInterval(interval);
        currentCount = count;
        if (element) {
          element.textContent = currentCount + suffix;
        }
      } else {
        if (element) {
          element.textContent = currentCount.toString();
        }
      }
    }, 10);
  }
  const t = useTranslations('home.platform');
  return (
    <div className="h-full pb-16">
      <h2 className="text-gradient px-8 pt-[4rem] text-center text-3xl font-medium leading-snug [transition:transform_1000ms_cubic-bezier(0.3,_1.17,_0.55,_0.99)_0s] md:px-32 md:text-[3rem] [.is-visible_&]:translate-y-0">
        {t('title3')}
      </h2>
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 h-1/2"></div>
          <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <dl className="rounded-lg sm:grid sm:grid-cols-3">
                <div ref={productRef} className="flex flex-col p-6 text-center">
                  <dt className="text-gradient order-2 mt-2 text-lg font-medium leading-6" id="item-1">
                    {t('productCounter')}
                  </dt>
                  <dd
                    className="text-gradient order-1 text-5xl font-semibold leading-none"
                    aria-describedby="item-1"
                    id="starsCount">
                    0
                  </dd>
                </div>
                <div ref={revenueRef} className="flex flex-col p-6 text-center">
                  <dt className="text-gradient order-2 mt-2 text-lg font-medium leading-6">{t('revenuCounter')}</dt>
                  <dd className="text-gradient order-1 text-5xl font-semibold leading-none" id="downloadsCount">
                    0
                  </dd>
                </div>
                <div ref={supplierRef} className="flex flex-col p-6 text-center">
                  <dt className="text-gradient order-2 mt-2 text-lg font-medium leading-6">{t('supplierCounter')}</dt>
                  <dd className="text-gradient order-1 text-5xl font-semibold leading-none" id="sponsorsCount">
                    0
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
