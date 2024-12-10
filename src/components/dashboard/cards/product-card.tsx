'use client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ColorType } from '@prisma/client';
import { colorHexMap, MEDIA_HOSTNAME, productCategoryOptions } from '@/lib/constants';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/navigation';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  category: productCategoryOptions;
  stock: number;
  wholesalePrice: number;
  profitMargin: number;
  colors: ColorType[];
  imageHeight: number;
  imageWidth: number;
  showDeleteIcon?: boolean;
  onDelete?: () => void;
  onClickNavigate?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  name,
  category,
  stock,
  wholesalePrice,
  profitMargin,
  colors,
  imageHeight,
  imageWidth,
  showDeleteIcon = false,
  onDelete,
  onClickNavigate = true,
}) => {
  const tFields = useTranslations('fields');
  const router = useRouter();
  const tMarketplace = useTranslations('dashboard.marketplace');

  return (
    <div
      onClick={() => {
        if (onClickNavigate) {
          router.push(`/dashboard/marketplace/all-products/${id}`);
        }
      }}
      className={cn(
        onClickNavigate ? 'cursor-pointer hover:scale-105' : '',
        'flex-col items-start justify-start gap-1 rounded-md border border-border/70 bg-background p-2 shadow-sm transition-transform duration-300 ease-in-out',
      )}>
      {/* Image container with fixed aspect ratio */}
      <div className="relative w-full pb-[100%]">
        {' '}
        {/* Aspect ratio: 1:1 */}
        <Badge className="absolute right-2 top-2 z-10" variant={stock > 0 ? 'success' : 'destructive'}>
          {stock > 6 ? tFields('in-stock') : tFields('out-of-stock')}
        </Badge>
        <Badge className="absolute right-2 top-8 z-10 text-white" variant={'primary'}>
          + {profitMargin}%
        </Badge>
        {showDeleteIcon && (
          <Button onClick={onDelete} className="absolute left-2 top-2 z-[1]" variant={'destructive'} size={'icon'}>
            <IconTrash className="text-white" />
          </Button>
        )}
        <Image
          className="absolute inset-0 h-full w-full rounded-md object-cover"
          src={`${MEDIA_HOSTNAME}${image}`}
          alt={name}
          height={imageHeight}
          width={imageWidth}
        />
      </div>

      {/* Product details */}
      <div className="flex w-full flex-col items-start justify-start pt-1">
        <p className="text-sm font-normal text-muted-foreground">{tFields(`category-${category.toLowerCase()}`)}</p>

        <h1 className="text-md max-w-full truncate font-medium">{name}</h1>
        <p className="flex w-full justify-between text-sm font-normal">
          {tFields('product-minimum-profit') + ' : '}
          <span className="font-semibold text-primary"> {(wholesalePrice * (profitMargin / 100)).toFixed(2)} TND</span>
        </p>
      </div>

      {/* Price and Action */}
      <div className="flex w-full flex-row items-center justify-between pt-1">
        <p className="text-md font-semibold md:text-lg">{wholesalePrice} TND</p>
        <Button
          className="h-8 px-4 font-medium md:px-4"
          size="sm"
          variant={'primary'}
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering the card's onClick
            router.push(`/dashboard/marketplace/all-products/${id}`);
          }}>
          <IconEye className="mr-2" />
          {tMarketplace('view-product')}
        </Button>
      </div>
    </div>
  );
};
