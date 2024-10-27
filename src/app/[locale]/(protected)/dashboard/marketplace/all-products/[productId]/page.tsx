import Breadcrumb from '@/components/ui/breadcrumb';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import NotFound from '@/app/[locale]/[...not_found]/page';
import { addToMyProducts, getProduct, removeFromMyProducts } from '@/actions/products';
import MarketplaceHeader from '@/components/dashboard/marketplace/header';
import ProductDetailsCard from '@/components/dashboard/cards/product-details-card';

interface ProductProps {
  params: { productId: string };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.marketplace' });

  return {
    title: t('product-details-metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce', 'Marketplace'],
  };
}

export default async function Product({ params }: ProductProps) {
  const t = await getTranslations('dashboard');

  const res = await getProduct(params.productId);
  if (res.error) {
    return NotFound();
  }
  const productData = res.error ? null : res.data;
  const breadcrumbItems = [
    { title: t('pages.products'), link: '/dashboard/marketplace/all-products' },
    { title: productData.name, link: '/#' },
  ];

  const handleAddToMyProducts = async (productId: string) => {
    'use server';
    const res = await addToMyProducts(productId);

    return res;
  };

  const handleRemoveFromMyProducts = async (productId: string) => {
    'use server';
    const res = await removeFromMyProducts(productId);

    return res;
  };

  return (
    <div className="h-full w-full">
      <MarketplaceHeader />

      <div className=" mt-4 h-full w-full">
        <Breadcrumb items={breadcrumbItems} />
        <ProductDetailsCard
          id={productData.id}
          media={productData.media}
          name={productData.name}
          supplierId={productData.supplierId}
          description={productData.description}
          sizes={productData.sizes}
          delivery={productData.delivery}
          category={productData.category}
          stock={productData.stock}
          sellers={productData.sellers}
          wholesalePrice={productData.wholesalePrice}
          profitMargin={productData.profitMargin}
          colors={productData.colors}
          onAddToMyProducts={handleAddToMyProducts}
          onRemoveFromMyProducts={handleRemoveFromMyProducts}
        />
      </div>
    </div>
  );
}
