'use client';

import { Button, LinkButton } from '@/components/ui/button';
import { TextPreview } from '@/components/ui/text-preview';
import { colorHexMap, colorOptions, MEDIA_HOSTNAME, productCategoryOptions, roleOptions } from '@/lib/constants';
import { ColorType, Product, SizeType } from '@prisma/client';
import {
  IconBoxMultiple,
  IconCashRegister,
  IconCategory2,
  IconCircleCheckFilled,
  IconCloudDownload,
  IconColorFilter,
  IconEdit,
  IconFileDescription,
  IconLoader2,
  IconPackage,
  IconPackageOff,
  IconPercentage,
  IconPlayerPlayFilled,
  IconShirt,
  IconShoppingCartPlus,
  IconShoppingCart,
  IconTruckLoading,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { startTransition, useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionResponse, MediaType } from '@/types';
import ReactPlayer from 'react-player';
import { Lens } from '@/components/ui/lens';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from '@/components/ui/use-toast';
import { getQueryClient } from '@/lib/query';

interface ProductDetailsProps {
  id: string;
  media: MediaType[];
  name: string;
  description: string;
  delivery: string;
  category: productCategoryOptions;
  stock: number;
  wholesalePrice: number;
  supplierId: string;
  sellers: any[];
  profitMargin: number;
  colors: ColorType[];
  sizes: SizeType[];
  onAddToMyProducts: (productId: string) => Promise<ActionResponse>;
  onRemoveFromMyProducts: (productId: string) => Promise<ActionResponse>;
}

export default function ProductDetailsCard(product: ProductDetailsProps) {
  const t = useTranslations('dashboard.text');
  const tMarketplace = useTranslations('dashboard.marketplace');
  const tValidation = useTranslations('validation');
  const tFields = useTranslations('fields');
  const user = useCurrentUser();
  const [mainMedia, setMainMedia] = useState(product.media[0]);
  const tColors = useTranslations('dashboard.colors');
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState<ColorType>();
  const [size, setSize] = useState<SizeType>();
  const queryClient = getQueryClient();
  const [isInMyProducts, setIsInMyProducts] = useState(product.sellers?.some((p) => p.id === user?.id));

  useEffect(() => {
    const isProductInMyProducts = product.sellers.some((p) => p.id === user?.id);
    setIsInMyProducts(!!isProductInMyProducts);
  }, [product.sellers, product.id, user?.id]);

  const downloadAllMedia = async () => {
    setIsDownloading(true); // Start loading
    const zip = new JSZip();
    let imageCount = 1;
    let videoCount = 1;

    try {
      // Loop over each media and add it to the zip
      const mediaPromises = product.media.map(async (media) => {
        const response = await fetch(`${MEDIA_HOSTNAME}${media.key}`);
        const blob = await response.blob();

        let fileName = '';
        const fileExtension = media.type.split('/')[1]; // Get the part after the '/'

        // Determine if it's an image or a video and name accordingly
        if (media.type.startsWith('image')) {
          fileName = `image ${imageCount}.${fileExtension}`;
          imageCount++;
        } else if (media.type.startsWith('video')) {
          fileName = `video ${videoCount}.${fileExtension}`;
          videoCount++;
        } else {
          // Fallback for other media types if needed
          fileName = `media ${imageCount + videoCount}.${fileExtension}`;
        }

        zip.file(fileName, blob); // Add the file to the zip
      });

      await Promise.all(mediaPromises);

      // Generate the ZIP file and trigger download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${product.name}-media.zip`);
    } catch (error) {
      console.error('Error downloading media:', error);
    } finally {
      setIsDownloading(false); // End loading
    }
  };

  const handleAddToMyProducts = async (productId: string) => {
    startTransition(async () => {
      const res = await product.onAddToMyProducts(productId);
      if (res.success) {
        setIsInMyProducts(true);
        toast({
          variant: 'success',
          title: tValidation('success-title'),
          description: tValidation(res.success),
        });
      } else {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation(res.error),
        });
      }
    });
  };

  const handleRemoveFromMyProducts = async (productId: string) => {
    startTransition(async () => {
      const res = await product.onRemoveFromMyProducts(productId);
      if (res.success) {
        setIsInMyProducts(false);
        toast({
          variant: 'success',
          title: tValidation('success-title'),
          description: tValidation(res.success),
        });
      } else {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation(res.error),
        });
      }
    });
  };

  return (
    <div className="flex h-full w-full animate-fade-in flex-col items-start justify-start gap-8 bg-page  ">
      {/* First row: media and product info */}
      <div className="relative flex w-full flex-col items-start justify-center gap-8 rounded-md border border-border bg-background p-4 lg:flex-row   lg:justify-center lg:gap-16 lg:p-8">
        {/* media section */}
        <div className="flex w-full flex-col items-start md:items-center lg:w-[50%]">
          <div className="flex w-full flex-col items-start justify-center gap-0  gap-x-4 gap-y-4 md:items-center  md:justify-end lg:flex-row">
            {/* Main image */}
            <div className="flex h-full  w-full items-center justify-center overflow-hidden rounded-lg lg:items-center lg:justify-end">
              {mainMedia.type.startsWith('video') ? (
                <ReactPlayer
                  url={`${MEDIA_HOSTNAME}${mainMedia.key}`}
                  controls={true}
                  width="500px"
                  height="500px"
                  onReady={() => setMediaLoaded(true)}
                  className="h-full rounded-md border border-border"
                />
              ) : (
                <Lens hovering={hovering} setHovering={setHovering}>
                  <Image
                    src={`${MEDIA_HOSTNAME}${mainMedia.key}`}
                    alt="Product Image"
                    height={400}
                    width={400}
                    onLoad={() => setMediaLoaded(true)}
                    className=" h-full w-full rounded-md object-contain lg:h-[500px] lg:w-[500px]"
                  />
                </Lens>
              )}
            </div>
            {/* Secondary media column */}

            <div className="flex w-full flex-wrap justify-center gap-2 md:gap-2 lg:w-fit lg:flex-col lg:justify-center">
              {product.media.slice(0, 10).map((media, index) =>
                mediaLoaded ? (
                  <button
                    key={index}
                    className=" group  h-[50px] w-[50px] overflow-hidden rounded-lg border transition-transform duration-300 ease-in-out hover:scale-105 hover:border-primary"
                    onClick={() => setMainMedia(media)}>
                    {media.type.startsWith('video') ? (
                      <div className="relative flex h-[50px] w-[50px] items-center justify-center bg-black">
                        <ReactPlayer
                          height="100%"
                          width="100%"
                          url={`${MEDIA_HOSTNAME}${media.key}`}
                          controls={false}
                          className="absolute"
                        />
                        <div className="absolute h-full w-full rounded-md bg-gray-600/50"></div>
                        <IconPlayerPlayFilled className="absolute z-[1] h-7 w-7 text-white group-hover:animate-pulse" />
                      </div>
                    ) : (
                      <Image
                        src={`${MEDIA_HOSTNAME}${media.key}`}
                        alt={`${index + 1}`}
                        height={50}
                        width={50}
                        className=" h-[50px] w-[50px] object-cover"
                      />
                    )}
                  </button>
                ) : (
                  <Skeleton key={index} className=" h-[50px] w-[50px] object-contain" />
                ),
              )}
            </div>
          </div>
        </div>
        {/* Product details section */}

        <div className="flex w-full flex-col items-start justify-start gap-3 space-y-3 lg:w-[45%]">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-row items-start justify-between">
              <div className="flex h-full w-full max-w-[90%] flex-col">
                {' '}
                <h1 className="text-xl font-bold lg:text-3xl">{product.name}</h1>
                <p className="text-muted-foreground">{tFields(`category-${product.category.toLowerCase()}`)}</p>
                <span className="pt-4 text-3xl font-bold lg:text-4xl">{product.wholesalePrice} TND</span>
              </div>
              {(user?.role === roleOptions.ADMIN ||
                (user?.role === roleOptions.SUPPLIER && product.supplierId === user.id)) && (
                <LinkButton
                  href={`/dashboard/${user?.role.toLowerCase()}/products/${product.id}`}
                  size={'sm'}
                  variant="secondary">
                  <IconEdit className="mr-2 h-5 w-5" />
                  {tMarketplace('edit-product')}
                </LinkButton>
              )}
            </div>
            <h3 className="text-lg font-semibold">{t('product-attributes')}</h3>
            <ul className="flex flex-col gap-y-4 text-sm ">
              <li className="flex w-full flex-col items-start justify-start gap-y-3 ">
                <div className="flex flex-row items-center justify-start gap-x-2 text-foreground">
                  <IconColorFilter className="" />
                  <span className="font-semibold">{tFields('product-colors')}</span>
                </div>
                {product.colors.length > 0 ? (
                  <div className="space-2 flex w-full flex-row flex-wrap gap-2">
                    {product.colors.map((item) => (
                      <Badge
                        variant={'background'}
                        key={item}
                        className="flex h-8 items-center justify-between space-x-2 text-sm font-normal hover:cursor-pointer">
                        {colorHexMap[item as keyof typeof colorHexMap] && (
                          <span
                            className="inline-block h-4 w-4 rounded-full border border-border"
                            style={{
                              backgroundColor: colorHexMap[item as keyof typeof colorHexMap],
                            }}></span>
                        )}
                        <p className="font-medium">{tColors(item)}</p>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('product-no-attribute')}</p>
                )}
              </li>
              <li className="flex w-full flex-col items-start justify-start gap-y-3 ">
                <div className="flex flex-row items-center justify-start gap-x-2">
                  <IconShirt className="" />
                  <span className="font-semibold">{tFields('product-sizes')}</span>
                </div>
                {product.sizes.length > 0 ? (
                  <div className="space-2 flex w-full flex-row flex-wrap gap-2">
                    {product.sizes.map((item) => (
                      <Badge
                        variant={'background'}
                        key={item}
                        className="flex h-8 items-center justify-between space-x-2 px-6 text-sm font-normal hover:cursor-pointer">
                        <p className="font-medium">{item}</p>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('product-no-attribute')}</p>
                )}
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{t('product-information')}</h3>
            <ul className="flex flex-col  gap-2 text-sm">
              <li className="flex items-center gap-2">
                <IconCategory2 className="" />
                <span className="font-semibold">{tFields('product-category')}</span>
                <span className="font-medium text-muted-foreground">
                  {tFields(`category-${product.category.toLowerCase()}`)}
                </span>
              </li>
              <li className="flex items-center justify-start gap-2">
                <IconTruckLoading className="" />
                <span className="font-semibold">{tFields('product-stock')}</span>
                <span className="font-medium  text-muted-foreground">
                  {product.stock > 6 ? `${product.stock} ${tFields('available')}` : tFields('out-of-stock')}
                </span>
              </li>

              <li className="flex items-center justify-start gap-2">
                <IconPercentage className="" />
                <span className="font-semibold">{tFields('product-profit-margin')}</span>
                <span className="font-medium  text-muted-foreground">{product.profitMargin}%</span>
              </li>
              <li className="flex items-center justify-start gap-2">
                <IconCashRegister className="" />
                <span className="font-semibold">{tFields('product-minimum-profit')}</span>
                <span className="font-medium  text-muted-foreground">
                  {(product.wholesalePrice * product.profitMargin) / 100} TND
                </span>
              </li>
            </ul>
          </div>
          {isInMyProducts && (
            <div
              className={`${
                isInMyProducts ? 'animate-fade-in ' : 'animate-fade-out'
              } flex w-full flex-row items-center justify-start rounded-md border border-border p-2 px-4 transition-transform duration-300 ease-in-out md:w-auto`}>
              <IconCircleCheckFilled className="mr-2 h-6 w-6 text-success" />
              <h1 className="text-sm">{tMarketplace('in-my-products')}</h1>
            </div>
          )}

          <div className="flex w-full flex-shrink flex-col flex-nowrap  gap-y-4 md:flex-row md:items-end md:justify-center md:gap-4 lg:justify-start">
            <Button
              onClick={() => {
                if (isInMyProducts) {
                  handleRemoveFromMyProducts(product.id);
                } else {
                  handleAddToMyProducts(product.id);
                }
              }}
              variant="primary"
              disabled={user?.role !== roleOptions.SELLER || product.stock === 0}>
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isInMyProducts ? tMarketplace('remove-from-my-products') : tMarketplace('add-to-my-products')}
                </>
              ) : (
                <>
                  {isInMyProducts ? (
                    <IconPackageOff className="mr-2 h-5 w-5" />
                  ) : (
                    <IconPackage className="mr-2 h-5 w-5" />
                  )}
                  {isInMyProducts ? tMarketplace('remove-from-my-products') : tMarketplace('add-to-my-products')}
                </>
              )}
            </Button>

            <Button onClick={downloadAllMedia} disabled={user?.role !== roleOptions.SELLER || product.stock === 0}>
              {!isDownloading && <IconCloudDownload className="mr-2 h-5 w-5" />}
              {isDownloading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
              {tMarketplace('download-media')}
            </Button>
          </div>
        </div>
      </div>

      {/* Second row: Description */}
      <div className="flex h-full min-h-32  w-full flex-col gap-x-8 gap-y-4 lg:flex-row">
        <div className="h-full w-full  flex-col items-start justify-start space-y-4 rounded-md border border-border bg-background p-4 text-lg">
          <p className="flex items-center justify-start gap-x-2  text-xl font-semibold">
            <IconFileDescription />

            {tFields('product-description')}
          </p>
          <div className="h-full w-full rounded-md border border-border p-2">
            <TextPreview value={product.description} />
          </div>
        </div>

        <div className="flex h-full w-full flex-col items-start justify-start space-y-4 rounded-md  border border-border bg-background p-4 text-lg text-foreground">
          <p className="flex items-center justify-start gap-x-2 text-xl font-semibold">
            <IconShoppingCart />
            {tFields('product-delivery')}
          </p>
          <div className="h-full w-full rounded-md border border-border p-2">
            <TextPreview value={product.delivery} />
          </div>
        </div>
      </div>
    </div>
  );
}
