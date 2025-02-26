'use client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ColorType } from '@prisma/client';
import { colorHexMap, MEDIA_HOSTNAME, productCategoryOptions, roleOptions } from '@/lib/constants';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Link, useRouter } from '@/navigation';
import { IconEye, IconLoader2, IconPackage, IconPackageOff, IconTrash } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { DataTableUser } from '@/types';
import { useCurrentUser } from '@/hooks/use-current-user';
import { addToMyProducts, removeFromMyProducts } from '@/actions/products';
import { toast } from '@/components/ui/use-toast';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  category: productCategoryOptions;
  stock: number;
  wholesalePrice: number;
  profitMargin: number;
  sellers: DataTableUser[];
  colors: ColorType[];
  supplierCode: string;
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
  supplierCode,
  sellers,
  imageHeight,
  imageWidth,
  showDeleteIcon = false,
  onDelete,
  onClickNavigate = true,
}) => {
  const tFields = useTranslations('fields');
  const router = useRouter();
  const tMarketplace = useTranslations('dashboard.marketplace');
  const user = useCurrentUser();
  const tValidation = useTranslations('validation');
  const [isLoading, startTransition] = useTransition();
  const [isInMyProducts, setIsInMyProducts] = useState(sellers?.some((p) => p.id === user?.id));

  const handleAddToMyProducts = async (productId: string) => {
    startTransition(async () => {
      const res = await addToMyProducts(productId);
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
      const res = await removeFromMyProducts(productId);
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
    <Link
      href={`/dashboard/marketplace/all-products/${id}`}
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
          {tFields('product-supplier') + ' : '}
          <span className="font-medium"> {supplierCode}</span>
        </p>
        <p className="flex w-full justify-between text-sm font-normal">
          {tFields('product-minimum-profit') + ' : '}
          <span className="font-semibold text-primary"> {(wholesalePrice * (profitMargin / 100)).toFixed(2)} TND</span>
        </p>
      </div>

      {/* Price and Action */}
      <div className="flex w-full flex-row items-center justify-between pt-1">
        <p className="text-md font-semibold md:text-lg">{wholesalePrice} TND</p>
        <Button
          onClick={(event) => {
            event?.preventDefault();

            if (isInMyProducts) {
              handleRemoveFromMyProducts(id);
            } else {
              handleAddToMyProducts(id);
            }
          }}
          className="h-8 px-4 font-medium md:px-4"
          size="sm"
          variant={isInMyProducts ? 'destructive' : 'primary'}
          disabled={user?.role !== roleOptions.SELLER || stock === 0}>
          {isLoading ? (
            <>
              <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
              {isInMyProducts ? tMarketplace('remove') : tMarketplace('add')}
            </>
          ) : (
            <>
              {isInMyProducts ? <IconPackageOff className="mr-2 h-5 w-5" /> : <IconPackage className="mr-2 h-5 w-5" />}
              {isInMyProducts ? tMarketplace('remove') : tMarketplace('add')}
            </>
          )}
        </Button>
      </div>
    </Link>
  );
};
