'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { ProductSchema } from '@/schemas';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  IconCloudUpload,
  IconDeviceFloppy,
  IconLoader2,
  IconPackage,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { colorOptions, MEDIA_HOSTNAME, productCategoryOptions, roleOptions, sizeOptions } from '@/lib/constants';
import { ActionResponse, DataTableUser, MediaType } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRouter } from '@/navigation';
import { editProduct } from '@/actions/products';
import { BadgeCombobox } from '@/components/ui/badge-combobox';
import { getSuppliers } from '@/actions/users';
import { UploadDropzone } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Product } from '@prisma/client';
import { TextEditor } from '@/components/ui/text-editor';
import ReactPlayer from 'react-player';
import { UserCombobox } from '../comboboxes/user-combobox';

interface EditProductFormProps extends React.HTMLAttributes<HTMLDivElement> {
  productData: (Product & { media: MediaType[] }) | null;
}

export function EditProductForm({ productData }: EditProductFormProps) {
  const role = useCurrentRole();

  const [isLoading, startTransition] = React.useTransition();
  const router = useRouter();
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const tColors = useTranslations('dashboard.colors');

  const [suppliers, setSuppliers] = React.useState<DataTableUser[]>([]);

  const sizes: sizeOptions[] = Object.values(sizeOptions);
  const [productSizes, setProductSizes] = React.useState<sizeOptions[]>(productData?.sizes as sizeOptions[]);

  const colors: colorOptions[] = Object.values(colorOptions);
  const [productColors, setProductColors] = React.useState<colorOptions[]>(productData?.colors as colorOptions[]);

  const [productMedia, setProductMedia] = React.useState<MediaType[]>(productData?.media || []);

  const [selectedMediaCount, setSelectedMediaCount] = React.useState(0);

  const [isDropped, setIsDropped] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
  const [selectedSupplierId, setSelectedSupplierId] = React.useState<string>(productData?.supplierId!);
  const [suppliersLoading, setSuppliersLoading] = React.useState<boolean>(false);

  type schemaType = z.infer<typeof ProductSchema>;

  const defaultValues = {
    name: productData?.name,
    category: productData?.category as productCategoryOptions,
    description: productData?.description,
    delivery: productData?.delivery,
    wholesalePrice: productData?.wholesalePrice.toString(),
    profitMargin: productData?.profitMargin.toString(),
    platformProfit: productData?.platformProfit?.toString(),
    featured: productData?.featured,
    published: productData?.published,
    stock: productData?.stock.toString(),
    sizes: productData?.sizes as sizeOptions[],
    colors: productData?.colors as colorOptions[],
    media: productData?.media as MediaType[],
    supplierId: productData?.supplierId!,
  };

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(ProductSchema), defaultValues });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      editProduct(productData!.id, data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });

          router.push(`/dashboard/${role?.toLowerCase()}/products`);
        } else {
          toast({
            variant: 'destructive',
            title: tValidation('error-title'),
            description: tValidation(res.error),
          });
        }
      });
    });
  };

  const handleSelectSize = (item: sizeOptions) => {
    const newSelected = productSizes.includes(item)
      ? productSizes.filter((size) => size !== item)
      : [...productSizes, item];
    setProductSizes(newSelected);
    setValue('sizes', newSelected);
  };

  const handleRemoveSize = (item: sizeOptions) => {
    const newSelected = productSizes.filter((size) => size !== item);
    setProductSizes(newSelected);
    setValue('sizes', newSelected);
  };

  const handleSelectColor = (item: colorOptions) => {
    const newSelected = productColors.includes(item)
      ? productColors.filter((color) => color !== item)
      : [...productColors, item];
    setProductColors(newSelected);
    setValue('colors', newSelected);
  };

  const handleRemoveColor = (item: colorOptions) => {
    const newSelected = productColors.filter((color) => color !== item);
    setProductColors(newSelected);
    setValue('colors', newSelected);
  };

  React.useEffect(() => {
    if (role === roleOptions.ADMIN) {
      const fetchSuppliers = async () => {
        setSuppliersLoading(true);
        const response = await getSuppliers();
        if (response.success) {
          setSuppliers(response.data || []);
        }
        setSuppliersLoading(false);
      };
      fetchSuppliers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (productMedia.length > 0) {
      const firstImageIndex = productMedia.findIndex((media) => media.type.startsWith('image/'));
      if (firstImageIndex > 0) {
        const reorderedMedia = [productMedia[firstImageIndex], ...productMedia.filter((_, i) => i !== firstImageIndex)];
        setProductMedia(reorderedMedia);
        setValue('media', reorderedMedia);
        setSelectedMediaIndex(0);
      }
    }
  }, [productMedia, setValue]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-8 pt-2">
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full rounded-lg border bg-background p-6">
          <div className="w-full rounded-lg p-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback>
                  <IconPackage className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="pb-4 text-lg font-semibold">{t('product-information')}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="code">{tFields('product-code')}</Label>
                  <Input
                    id="code"
                    disabled
                    defaultValue={productData?.code}
                    placeholder={tFields('product-code')}
                    type="text"
                  />
                </LabelInputContainer>
              )}
              <LabelInputContainer>
                <Label htmlFor="name">{tFields('product-name')}</Label>
                <Input
                  {...register('name')}
                  id="name"
                  disabled={isLoading}
                  placeholder={tFields('product-name')}
                  type="text"
                />
                {errors.name && <span className="text-xs text-red-400">{tValidation('product-name-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="delivery">
                  {tFields('product-delivery')}
                  <span className="ml-2 text-xs text-gray-400">{t('delivery-note')}</span>
                </Label>
                <TextEditor
                  value={getValues('delivery')}
                  disabled={isLoading}
                  onChange={(value) => setValue('delivery', value)}
                />

                {errors.delivery && (
                  <span className="text-xs text-red-400">{tValidation('product-delivery-error')}</span>
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="description">{tFields('product-description')}</Label>
                <TextEditor
                  value={getValues('description')}
                  disabled={isLoading}
                  onChange={(value) => setValue('description', value)}
                />
                {errors.description && (
                  <span className="text-xs text-red-400">{tValidation('product-description-error')}</span>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="category">{tFields('product-category')}</Label>
                <Select
                  defaultValue={getValues('category')}
                  onValueChange={(value: keyof typeof productCategoryOptions) =>
                    setValue('category', productCategoryOptions[value])
                  }>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={tFields('product-category')}
                      defaultValue={getValues('category')}
                      id="category"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(productCategoryOptions).map((option) => (
                        <SelectItem
                          key={option}
                          value={option as (typeof productCategoryOptions)[keyof typeof productCategoryOptions]}>
                          {tFields(`category-${option.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <span className="text-xs text-red-400">{tValidation('product-category-error')}</span>
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="wholesalePrice">{tFields('product-wholesale-price')}</Label>
                <Input
                  {...register('wholesalePrice')}
                  disabled={isLoading}
                  id="wholesalePrice"
                  placeholder={tFields('product-wholesale-price')}
                  type="text"
                />
                {errors.wholesalePrice && (
                  <span className="text-xs text-red-400">{tValidation('product-wholesale-price-error')}</span>
                )}
              </LabelInputContainer>
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="platformProfit">{tFields('product-platform-profit')} (TND)</Label>
                  <Input
                    {...register('platformProfit')}
                    disabled={isLoading}
                    id="platformProfit"
                    placeholder={tFields('product-platform-profit')}
                    type="text"
                  />
                  {errors.platformProfit && (
                    <span className="text-xs text-red-400">{tValidation('product-platform-profit-error')}</span>
                  )}
                </LabelInputContainer>
              )}
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="profitMargin">{tFields('product-profit-margin')}</Label>
                  <Input
                    {...register('profitMargin')}
                    disabled={isLoading}
                    id="profitMargin"
                    placeholder={tFields('product-profit-margin')}
                    type="text"
                  />
                  {errors.profitMargin && (
                    <span className="text-xs text-red-400">{tValidation('product-profit-margin-error')}</span>
                  )}
                </LabelInputContainer>
              )}
              <LabelInputContainer>
                <Label htmlFor="stock">{tFields('product-stock')}</Label>
                <Input
                  {...register('stock')}
                  disabled={isLoading}
                  id="stock"
                  placeholder={tFields('product-stock')}
                  type="text"
                />
                {errors.stock && <span className="text-xs text-red-400">{tValidation('product-stock-error')}</span>}
              </LabelInputContainer>
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="featured">{tFields('product-featured')}</Label>

                  <div className="flex h-11 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('featured-note')}
                    </div>
                    <Switch
                      defaultChecked={getValues('featured')}
                      onCheckedChange={(checked) => setValue('featured', checked)}
                      id="featured"
                    />
                  </div>
                </LabelInputContainer>
              )}
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="published">{tFields('product-published')}</Label>

                  <div className="flex h-11 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('published-note')}
                    </div>
                    <Switch
                      defaultChecked={getValues('published')}
                      onCheckedChange={(checked) => setValue('published', checked)}
                      id="published"
                    />
                  </div>
                </LabelInputContainer>
              )}
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="supplierId">{tFields('product-supplier')}</Label>
                  <UserCombobox
                    users={suppliers}
                    selectedUserId={selectedSupplierId}
                    onSelectUser={(userId: string) => {
                      setSelectedSupplierId(userId);
                      setValue('supplierId', userId);
                    }}
                    placeholder={tFields('product-supplier-placeholder')}
                    loading={suppliersLoading}
                  />
                  {errors.supplierId && (
                    <span className="text-xs text-red-400">{tValidation('product-supplier-error')}</span>
                  )}
                </LabelInputContainer>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-lg border bg-background p-6 ">
          <h2 className="pb-2 text-lg font-semibold">{t('product-attributes')}</h2>
          <div className="pb-8 text-sm font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('product-attributes-note')}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInputContainer>
              <Label htmlFor="sizes">{tFields('product-sizes')}</Label>
              <BadgeCombobox
                items={sizes}
                selectedItems={productSizes}
                placeholder={tFields('product-sizes-placeholder')}
                displayValue={(item) => item}
                onSelect={handleSelectSize}
                onRemove={handleRemoveSize}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="colors">{tFields('product-colors')}</Label>
              <BadgeCombobox
                items={colors}
                selectedItems={productColors}
                placeholder={tFields('product-colors-placeholder')}
                displayValue={(item) => tColors(item)}
                onSelect={handleSelectColor}
                onRemove={handleRemoveColor}
                isColorPicker
              />
              {errors.colors && <span className="text-xs text-red-400">{tValidation('product-color-error')}</span>}
            </LabelInputContainer>
          </div>
        </div>
        <div className="flex flex-col rounded-lg border bg-background p-6 ">
          <h2 className="pb-2 text-lg font-semibold">{t('product-media')}</h2>
          <div className="pb-8 text-sm font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('product-media-note')}
          </div>
          <div className="flex w-full flex-col items-center justify-center  space-y-3">
            {productMedia.length < 10 && (
              <UploadDropzone
                className={cn(
                  'data-ut-button:h-11 h-full w-full  rounded-md border-gray-500/40  bg-background ut-button:rounded-md ut-button:border-none ut-button:bg-foreground ut-button:text-sm ut-button:font-semibold ut-button:text-background ut-button:ring-offset-background ut-button:focus-within:bg-foreground ut-button:hover:bg-foreground/80 ut-button:focus:bg-foreground ut-button:focus-visible:outline-none ut-button:focus-visible:ring-2 ut-button:focus-visible:ring-ring ut-button:focus-visible:ring-offset-2 ut-button:active:bg-foreground ut-uploading:pointer-events-none lg:w-full',
                )}
                endpoint={'productMedia'}
                appearance={{
                  button:
                    'focus-within:ring-foreground ut-ready:bg-foreground ut-uploading:cursor-not-allowed after:bg-foreground',
                  allowedContent: 'text-secondary',
                }}
                content={{
                  button({ ready, isUploading, uploadProgress }) {
                    if (isUploading)
                      return (
                        <div className="z-[5] flex flex-row">
                          <IconLoader2 className="z-[5] mr-2 h-5 w-5 animate-spin" />
                          {uploadProgress} %
                        </div>
                      );
                    if (!ready) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;
                    if (isDropped)
                      return (
                        <div>
                          {' '}
                          {t('dropzone-start-upload-button')} ({selectedMediaCount})
                        </div>
                      );
                    return <div className="px-1">{t('dropzone-multi-upload-button')}</div>;
                  },
                  uploadIcon() {
                    return <IconCloudUpload className="h-12 w-12 text-primary" />;
                  },
                  label({ isUploading }) {
                    if (isDropped && !isUploading) {
                      return <div className="px-2 text-foreground">{t('dropzone-start-upload-label')} </div>;
                    }
                    if (isUploading) {
                      return <div className="px-2 text-foreground">{t('dropzone-time-label')}</div>;
                    }
                    return <div className="px-2 text-foreground">{t('dropzone-label')}</div>;
                  },
                }}
                onChange={(files) => {
                  setSelectedMediaCount(files.length);
                  setIsDropped(true);
                }}
                onUploadBegin={() => {
                  setIsUploading(true);
                }}
                onClientUploadComplete={(res) => {
                  setIsDropped(false);
                  setIsUploading(false);

                  const newMedia = res.map((file) => ({ key: file.key, type: file.type }));
                  const newImages = newMedia.filter((file) => file.type.startsWith('image/'));
                  const newVideos = newMedia.filter((file) => file.type.startsWith('video/'));

                  const currentImages = productMedia.filter((media) => media.type.startsWith('image/'));
                  const currentVideos = productMedia.filter((media) => media.type.startsWith('video/'));

                  if (currentImages.length + newImages.length > 8) {
                    toast({
                      variant: 'destructive',
                      title: tValidation('error-title'),
                      description: tValidation('media-max-images-error'),
                    });
                  } else if (currentVideos.length + newVideos.length > 2) {
                    toast({
                      variant: 'destructive',
                      title: tValidation('error-title'),
                      description: tValidation('media-max-videos-error'),
                    });
                  } else {
                    const updatedMedia = [...productMedia, ...newMedia];
                    setProductMedia(updatedMedia);
                    setValue('media', updatedMedia);

                    toast({
                      variant: 'success',
                      title: tValidation('success-title'),
                      description: tValidation('media-upload-success'),
                    });
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false);
                  toast({
                    variant: 'destructive',
                    title: tValidation('error-title'),
                    description: tValidation('media-upload-error'),
                  });
                }}
              />
            )}
            {isClient && productMedia.length > 0 && (
              <div className="flex w-full flex-col flex-wrap items-center justify-start gap-6 pt-2 md:flex-row">
                {productMedia.map((media: MediaType, index) => (
                  <div
                    key={index}
                    className={cn(
                      'relative cursor-pointer rounded-md border border-border p-2',
                      selectedMediaIndex === index && media.type.startsWith('image/')
                        ? 'border-[5px] border-primary'
                        : '',
                    )}
                    onClick={() => {
                      if (media.type.startsWith('image/')) {
                        const reorderedMedia = [media, ...productMedia.filter((_, i) => i !== index)];
                        setProductMedia(reorderedMedia);
                        setValue('media', reorderedMedia);
                        setSelectedMediaIndex(0);
                      }
                    }}>
                    {media.type.startsWith('image/') ? (
                      <Image
                        src={`${MEDIA_HOSTNAME}${media.key}`}
                        alt={`Product Image ${index + 1}`}
                        width={200}
                        height={200}
                        className="h-[200px] w-[200px] rounded-md object-fill"
                      />
                    ) : (
                      <div className="relative flex h-[200px] w-[300px] items-center justify-center">
                        <ReactPlayer
                          height="100%"
                          width="100%"
                          url={`${MEDIA_HOSTNAME}${media.key}`}
                          controls={false}
                          className="absolute"
                        />
                        <div className="absolute h-full w-full rounded-md bg-gray-600/50"></div>
                        <IconPlayerPlayFilled className="absolute z-[1] h-10 w-10 text-white" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant={'destructive'}
                      size={'icon'}
                      className="absolute right-2 top-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updatedmedia = productMedia.filter((m) => m.key !== media.key);
                        setProductMedia(updatedmedia);
                        setValue('media', updatedmedia);

                        if (index === 0) setSelectedMediaIndex(0);
                      }}>
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {errors.media && <span className="text-xs text-red-400">{tValidation('product-media-error')}</span>}
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-4">
          <Button type="submit" className="h-12" size="default" disabled={isLoading || isUploading}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
            {t('save-button')}
          </Button>
        </div>
      </form>
    </div>
  );
}
