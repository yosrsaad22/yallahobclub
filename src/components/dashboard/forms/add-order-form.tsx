'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { OrderSchema } from '@/schemas';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  IconDeviceFloppy,
  IconExclamationCircle,
  IconLoader2,
  IconTrash,
  IconShoppingCart,
  IconUser,
  IconInfoCircleFilled,
} from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { MEDIA_HOSTNAME, roleOptions, colorHexMap, states } from '@/lib/constants';
import { ActionResponse, DataTableUser, MediaType, OrderProduct } from '@/types';
import { useRouter } from '@/navigation';
import { getSellers } from '@/actions/users';
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/use-current-user';
import { addOrder } from '@/actions/orders';
import { Combobox } from '@/components/ui/combobox';
import { getProducts, getProductsBySeller } from '@/actions/products';
import { ProductCombobox } from '../comboboxes/product-combobox';
import { SizePickerCombobox } from '../comboboxes/size-combobox';
import { ColorPickerCombobox } from '../comboboxes/color-combobox';
import { Product as PrismaProduct } from '@prisma/client';

interface Product extends PrismaProduct {
  supplierCode: string;
  media: MediaType[];
}
import { UserCombobox } from '../comboboxes/user-combobox';
import { Switch } from '@/components/ui/switch';

interface AddOrderFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AddOrderForm({}: AddOrderFormProps) {
  const user = useCurrentUser();
  const role = user?.role;
  const userId = user?.id;

  const [isLoading, startTransition] = React.useTransition();
  const router = useRouter();
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const tColors = useTranslations('dashboard.colors');

  const [state, setState] = React.useState<string>();
  const [sellers, setSellers] = React.useState<DataTableUser[]>([]);
  const [productsLoading, setProductsLoading] = React.useState<boolean>(false);
  const [sellersLoading, setSellersLoading] = React.useState<boolean>(false);
  const [orderProducts, setOrderProducts] = React.useState<(Product & { media: MediaType[] })[]>([]);
  const [selectedOrderProducts, setSelectedOrderProducts] = React.useState<OrderProduct[]>([]);
  const [selectedSellerId, setSelectedSellerId] = React.useState<string>('');
  const [deliveryFee, setDeliveryFee] = React.useState<number>(8);
  type schemaType = z.infer<typeof OrderSchema>;

  const defaultValues = {
    sellerId: role === roleOptions.SELLER ? userId : undefined,
    state: state,
    openable: false,
    fragile: false,
  };

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(OrderSchema), defaultValues });

  const validateSelectedProducts = (
    selectedOrderProducts: OrderProduct[],
    orderProducts: (Product & { media: MediaType[] })[],
  ) => {
    for (let i = 0; i < selectedOrderProducts.length; i++) {
      const selectedProduct = selectedOrderProducts[i];
      const product = orderProducts.find((p) => p.id === selectedProduct.productId);

      if (!product) continue; // Skip if the product is not found

      // Check if color is required but missing
      if (product.colors.length > 0 && !selectedProduct.color) {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation('order-color-error', { name: product.name }),
        });
        return false;
      }

      // Check if detail price is invalid (should be at least 10% above wholesale price)
      if (
        product.wholesalePrice &&
        product.wholesalePrice + product.wholesalePrice * 0.1 > parseFloat(selectedProduct.detailPrice)
      ) {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation('order-invalid-detail-price', { name: product.name }),
        });
        return false;
      }

      // Check if detail price is below minimum detail price
      if (product.minimumDetailPrice && parseFloat(selectedProduct.detailPrice) < product.minimumDetailPrice) {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation('order-minimum-detail-price-error', {
            name: product.name,
            minimumPrice: product.minimumDetailPrice.toFixed(2),
          }),
        });
        return false;
      }

      // Check if size is required but missing
      if (product.sizes.length > 0 && !selectedProduct.size) {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation('order-size-error', { name: product.name }),
        });
        return false;
      }

      if (product.stock < parseInt(selectedProduct.quantity) + 6) {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation('order-stock-error', { name: product.name }),
        });
        return false;
      }

      // Check for duplicates by looping through the remaining products
      for (let j = i + 1; j < selectedOrderProducts.length; j++) {
        const otherProduct = selectedOrderProducts[j];

        // Check if they are the same product
        if (selectedProduct.productId === otherProduct.productId) {
          // Check if both color and size are undefined or the same
          const sameColor = selectedProduct.color === otherProduct.color;
          const sameSize = selectedProduct.size === otherProduct.size;

          if (
            (sameColor && sameSize) || // Both are the same
            (sameColor && !selectedProduct.size && !otherProduct.size) || // Color same, size undefined
            (sameSize && !selectedProduct.color && !otherProduct.color) // Size same, color undefined
          ) {
            toast({
              variant: 'destructive',
              title: tValidation('error-title'),
              description: tValidation('order-duplicate-error', { name: product.name }),
            });
            return false; // Stop further validation
          }
        }
      }
    }

    return true; // Return true if validation passed
  };

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();

    const isValid = validateSelectedProducts(selectedOrderProducts, orderProducts);

    if (!isValid) return;

    startTransition(() => {
      const updatedProducts = selectedOrderProducts.map((selectedProduct) => {
        const product = orderProducts.find((p) => p.id === selectedProduct.productId);

        // Ensure we have valid values for quantity and detail price
        const quantity = parseInt(selectedProduct.quantity) || 1;
        const wholesalePrice = product?.wholesalePrice || 0;
        const platformProfit = product?.platformProfit || 0;

        const supplierProfit = (wholesalePrice - platformProfit) * quantity; //
        return {
          ...selectedProduct,
          quantity: quantity.toString(), // Always ensure quantity is a string
          supplierProfit: parseFloat(supplierProfit.toFixed(2)), // Ensure precision and prevent negative or NaN values
        };
      });

      data.products = updatedProducts;

      addOrder(data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });

          router.push(`/dashboard/${role?.toLowerCase()}/orders`);
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

  const [platformProfit, setPlatformProfit] = React.useState<number>(0);
  const [totalPlatformProfit, setTotalPlatformProfit] = React.useState<number>(0);
  const [sellerProfit, setSellerProfit] = React.useState<number>(0);
  const [isComposedOrder, setIsComposedOrder] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);

  React.useEffect(() => {
    let totalSellerProfit = 0;
    let totalPlatformProfit = 0;
    let totalPrice = 0;
    const suppliers = new Set<string>();
    selectedOrderProducts.forEach((selectedProduct) => {
      const product = orderProducts.find((p) => p.id === selectedProduct.productId);
      if (!product) return;

      suppliers.add(product.supplierId!);

      // Ensure valid values for calculations
      const quantity = parseInt(selectedProduct.quantity) || 1;
      const detailPrice = parseFloat(selectedProduct.detailPrice) || 0;
      const wholesalePrice = product.wholesalePrice || 0;
      const platformProfit = product.platformProfit!;

      // Calculate seller profit per product
      const sellerProfit = (detailPrice - wholesalePrice) * quantity;

      // Accumulate seller profit and total price
      totalSellerProfit += sellerProfit;
      totalPlatformProfit += platformProfit * quantity;
      totalPrice += detailPrice * quantity;
    });

    setIsComposedOrder(suppliers.size > 1);

    suppliers.size > 1 ? setDeliveryFee(7 * suppliers.size) : setDeliveryFee(8);
    // Add delivery fee to the total price
    totalPrice += suppliers.size > 1 ? 7 * suppliers.size : 8;

    // Calculate platform profit as 10% of total seller profit
    totalPlatformProfit =
      totalPlatformProfit + parseFloat((totalSellerProfit * 0.1).toFixed(2)) + (suppliers.size > 1 ? 0 : 1);

    // Ensure no NaN or invalid values
    totalSellerProfit = totalSellerProfit > 0 ? totalSellerProfit * 0.9 : 0;
    totalPlatformProfit = totalPlatformProfit > 0 ? totalPlatformProfit : 0;
    totalPrice = totalPrice > 0 ? totalPrice : 0;

    // Update state values
    setSellerProfit(totalSellerProfit);
    setPlatformProfit(totalPlatformProfit);
    setTotal(totalPrice);

    setValue('total', totalPrice);
  }, [selectedOrderProducts, orderProducts, setValue]);

  React.useEffect(() => {
    setSelectedOrderProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        supplierProfit: 0,
        platformProfit: 0,
        detailPrice: '0',
      })),
    );
  }, []);

  React.useEffect(() => {
    if (role === roleOptions.ADMIN) {
      const fetchSellers = async () => {
        setSellersLoading(true);
        const response = await getSellers();
        if (response.success) {
          setSellers(response.data || []);
        }
        setSellersLoading(false);
      };
      fetchSellers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      const response = await (role === roleOptions.ADMIN ? getProducts() : getProductsBySeller());

      if (response.success) {
        setOrderProducts(response.data || []);
      }
      setProductsLoading(false);
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectOrderProduct = (newProduct: OrderProduct) => {
    const product = orderProducts.find((p) => p.id === newProduct.productId); // Ensure you find the product by productId
    if (!product) return; // Prevent adding the product if it's not found

    // Create the new product with necessary fields
    const updatedProduct = {
      ...newProduct,
      productId: product.id,
      // Calculate the default detail price as wholesale price + profit margin percentage of the wholesale price
      detailPrice: (product.wholesalePrice + (product.wholesalePrice * product.profitMargin) / 100).toFixed(2),
      quantity: '1', // Ensure the productId is set
      supplierProfit: newProduct.supplierProfit,
    };

    // Update the selected order products and form state
    setSelectedOrderProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, updatedProduct];

      setValue('products', updatedProducts); // Set the form value directly here
      return updatedProducts; // Return updated state
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-8 pt-2">
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full rounded-lg border bg-background p-6">
          <div className="w-full rounded-lg p-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback>
                  <IconShoppingCart className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="mb-5 flex w-full items-center space-x-4 rounded-md border border-border bg-background p-2 ">
            <IconInfoCircleFilled className="h-10 w-10 flex-shrink-0  text-primary" />
            <h1 className="text-sm text-muted-foreground">{t('check-stock')} </h1>
          </div>
          <div className="flex flex-col">
            <h2 className=" text-lg font-semibold">{t('client-information')}</h2>
            <p className="pb-6 text-sm text-muted-foreground">{t('required-note')}</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="firstName">
                  {tFields('order-first-name')}
                  <span className="font-bold text-destructive"> *</span>
                </Label>
                <Input
                  {...register('firstName')}
                  id="firstName"
                  disabled={isLoading}
                  placeholder={tFields('order-first-name')}
                  type="text"
                />
                {errors.firstName && (
                  <span className="text-xs text-red-400">{tValidation('order-first-name-error')}</span>
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">
                  {tFields('order-last-name')}
                  <span className="font-bold text-destructive"> *</span>
                </Label>
                <Input
                  {...register('lastName')}
                  id="lastName"
                  disabled={isLoading}
                  placeholder={tFields('order-last-name')}
                  type="text"
                />
                {errors.lastName && (
                  <span className="text-xs text-red-400">{tValidation('order-last-name-error')}</span>
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="number">
                  {tFields('order-number')}
                  <span className="font-bold text-destructive"> *</span>
                </Label>
                <Input
                  {...register('number')}
                  id="number"
                  disabled={isLoading}
                  placeholder={tFields('order-number')}
                  type="text"
                />
                {errors.number && <span className="text-xs text-red-400">{tValidation('order-number-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label>
                  {tFields('order-state')}
                  <span className="font-bold text-destructive"> *</span>
                </Label>
                <Combobox
                  items={states}
                  selectedItems={state}
                  onSelect={(selectedItem: string) => {
                    setState(selectedItem);
                    setValue('state', selectedItem);
                  }}
                  placeholder={tFields('order-state-placeholder')}
                  displayValue={(item: string) => item}
                  itemKey={(item: string) => states.indexOf(item).toString()}
                  multiSelect={false}
                />
                {errors.state && <span className="text-xs text-red-400">{tValidation('order-state-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="city">
                  {tFields('order-city')}
                  <span className="font-bold text-destructive"> *</span>
                </Label>
                <Input
                  {...register('city')}
                  id="city"
                  disabled={isLoading}
                  placeholder={tFields('order-city')}
                  type="text"
                />
                {errors.city && <span className="text-xs text-red-400">{tValidation('order-city-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="address">
                  {tFields('order-address')}
                  <span className="font-bold text-destructive"> *</span>
                </Label>
                <Input
                  {...register('address')}
                  id="address"
                  disabled={isLoading}
                  placeholder={tFields('order-address')}
                  type="text"
                />
                {errors.address && <span className="text-xs text-red-400">{tValidation('order-address-error')}</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">{tFields('order-email')}</Label>
                <Input
                  {...register('email')}
                  disabled={isLoading}
                  id="email"
                  placeholder={tFields('order-email')}
                  type="email"
                />
                {errors.email && <span className="text-xs text-red-400">{tValidation('order-email-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="comment">{tFields('order-comment')}</Label>
                <Input
                  {...register('comment')}
                  id="comment"
                  disabled={isLoading}
                  placeholder={tFields('order-comment')}
                  type="text"
                />
                {errors.comment && <span className="text-xs text-red-400">{tValidation('order-comment-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="openable">{tFields('order-openable')}</Label>
                <div className="flex h-11 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('openable-note')}
                  </div>
                  <Switch
                    defaultChecked={false}
                    onCheckedChange={(checked) => setValue('openable', checked)}
                    id="openable"
                  />
                </div>
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="fragile">{tFields('order-fragile')}</Label>
                <div className="flex h-11 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('fragile-note')}
                  </div>
                  <Switch
                    defaultChecked={false}
                    onCheckedChange={(checked) => setValue('fragile', checked)}
                    id="fragile"
                  />
                </div>
              </LabelInputContainer>
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="sellerId">
                    {tFields('order-seller')}
                    <span className="font-bold text-destructive"> *</span>
                  </Label>
                  <UserCombobox
                    users={sellers}
                    selectedUserId={selectedSellerId}
                    onSelectUser={(userId: string) => {
                      setSelectedSellerId(userId);
                      setValue('sellerId', userId);
                    }}
                    placeholder={tFields('order-seller-placeholder')}
                    loading={sellersLoading}
                  />
                  {errors.sellerId && <span className="text-xs text-red-400">{tValidation('order-seller-error')}</span>}
                </LabelInputContainer>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-lg border bg-background p-6">
          <h2 className=" text-lg font-semibold">{t('order-information')}</h2>
          <p className=" text-sm text-muted-foreground">{t('order-products-note')}</p>
          <div className="my-6 flex w-full items-center space-x-4 rounded-md border border-border bg-background p-2">
            <IconInfoCircleFilled className="h-9 w-9 flex-shrink-0  text-primary" />
            <h1 className="text-sm text-muted-foreground">{t('multi-order-note')} </h1>
          </div>
          <LabelInputContainer>
            <Label className="flex items-center justify-between" htmlFor="my-products">
              {' '}
              {tFields('order-products')}
              <span className="font-bold text-destructive"> *</span>
            </Label>
            <ProductCombobox
              placeholder={t('select-order-product')}
              products={orderProducts}
              onSelectProduct={handleSelectOrderProduct}
              loading={productsLoading}
            />
            <div className="flex flex-col gap-2">
              {selectedOrderProducts.map((product, index) => (
                <div key={index} className="flex flex-col items-start justify-start gap-2">
                  <div
                    key={index}
                    className="flex h-full w-full flex-col items-center gap-6 rounded-md border border-border p-4 md:flex-row">
                    {/* Product Image */}
                    <Image
                      className="rounded-md object-contain"
                      src={`${MEDIA_HOSTNAME}${orderProducts.find((p) => p.id === product.productId)?.media[0].key}`}
                      alt={orderProducts.find((p) => p.id === product.productId)?.name!}
                      height={170}
                      width={170}
                    />

                    <div className="items-between flex h-full w-full flex-col justify-between gap-4 text-sm md:max-w-[20%]">
                      <p className="text-md flex font-medium">
                        {orderProducts.find((p) => p.id === product.productId)?.name}{' '}
                      </p>
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-muted-foreground">
                          {tFields('product-stock')} :{' '}
                          <span className="text-foreground">
                            {orderProducts.find((p) => p.id === product.productId)?.stock}
                          </span>
                        </span>
                        <span className="font-semibold text-muted-foreground">
                          {tFields('product-wholesale-price')} :{' '}
                          <span className="text-foreground">
                            {orderProducts.find((p) => p.id === product.productId)?.wholesalePrice} TND
                          </span>
                        </span>
                        <span className="font-semibold text-muted-foreground">
                          {tFields('product-profit-margin')} :{' '}
                          <span className="text-foreground">
                            {orderProducts.find((p) => p.id === product.productId)?.profitMargin}%
                          </span>
                        </span>
                        <span className="font-semibold text-muted-foreground">
                          {tFields('product-minimum-profit')} :{' '}
                          <span className="text-foreground">
                            {(() => {
                              const foundProduct = orderProducts.find((p) => p.id === product.productId);
                              return foundProduct ? (foundProduct.wholesalePrice * foundProduct.profitMargin) / 100 : 0;
                            })()}{' '}
                            TND
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Colors and Sizes */}
                    <div className="flex w-full flex-col items-start justify-center gap-6 md:w-[30%]">
                      <LabelInputContainer>
                        <Label htmlFor="my-products">{tFields('product-color')}</Label>
                        <ColorPickerCombobox
                          colors={orderProducts.find((p) => p.id === product.productId)?.colors || []}
                          selectedColor={product.color}
                          onSelectColor={(color: any) => {
                            setSelectedOrderProducts((prevProducts) =>
                              prevProducts.map((p, i) => (i === index ? { ...p, color } : p)),
                            );
                          }}
                          placeholder={tFields('product-color-placeholder')}
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="my-products">{tFields('product-size')}</Label>
                        <SizePickerCombobox
                          sizes={orderProducts.find((p) => p.id === product.productId)?.sizes || []}
                          selectedSize={product.size}
                          onSelectSize={(size: any) => {
                            setSelectedOrderProducts((prevProducts) =>
                              prevProducts.map((p, i) => (i === index ? { ...p, size } : p)),
                            );
                          }}
                          placeholder={tFields('product-size-placeholder')}
                        />
                      </LabelInputContainer>
                    </div>

                    {/* Quantity Input */}
                    <div className="items-between flex h-full w-full flex-col justify-center gap-6 md:w-[30%]">
                      <LabelInputContainer>
                        <Label htmlFor={`quantity-${index}`}>
                          {' '}
                          {/* Use dynamic id */}
                          {tFields('product-quantity')}
                          <span className="font-bold text-destructive"> *</span>:
                        </Label>
                        <Input
                          id={`quantity-${index}`} // Set the same id here as in the label's for attribute
                          type="text"
                          className="h-11"
                          value={product.quantity || ''} // No default, so user can clear the input
                          {...register(`products.${index}.quantity`)} // Register the field with form handling
                          onChange={(e) => {
                            let newQuantity = e.target.value;
                            setSelectedOrderProducts((prevProducts) =>
                              prevProducts.map((p, i) => (i === index ? { ...p, quantity: newQuantity } : p)),
                            );
                          }}
                        />
                      </LabelInputContainer>

                      {/* Detail Price Input */}
                      <LabelInputContainer>
                        <Label htmlFor={`detailPrice-${index}`}>
                          {' '}
                          {/* Use dynamic id */}
                          {tFields('product-selling-price')}
                          <span className="font-bold text-destructive"> *</span>:
                        </Label>
                        <Input
                          id={`detailPrice-${index}`} // Set the same id here as in the label's for attribute
                          type="text" // Set input type to "text" to allow for comma input
                          className="h-11"
                          value={product.detailPrice} // No default, so user can clear the input
                          {...register(`products.${index}.detailPrice`)} // Register the field with form handling
                          onChange={(e) => {
                            let newDetailPrice = e.target.value.replace(',', '.'); // Replace comma with dot
                            setSelectedOrderProducts((prevProducts) =>
                              prevProducts.map((p, i) => (i === index ? { ...p, detailPrice: newDetailPrice } : p)),
                            );
                          }}
                        />
                      </LabelInputContainer>
                    </div>

                    {/* Delete Button */}
                    <div className="flex  items-center px-2">
                      <Button
                        className=""
                        variant="outline"
                        size="icon"
                        onClick={(event) => {
                          event.preventDefault();
                          setSelectedOrderProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
                          setValue('products', selectedOrderProducts);
                        }}>
                        <IconTrash className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {/* Error message for quantity */}
                  {errors.products?.[index]?.quantity && (
                    <span className="text-xs text-red-400">{tValidation('order-quantity-error')}</span>
                  )}
                  {/* Error message for detailPrice */}
                  {errors.products?.[index]?.detailPrice && (
                    <span className="text-xs text-red-400">{tValidation('order-detail-price-error')}</span>
                  )}
                </div>
              ))}
              {selectedOrderProducts.length > 0 && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border p-4 text-sm ">
                  {selectedOrderProducts.map((product, index) => {
                    const selectedProduct = orderProducts.find((p) => p.id === product.productId);
                    return (
                      <div key={index} className="flex w-full items-start justify-between font-medium">
                        <span className="max-w-[70%]">
                          {product.quantity ?? 1} x {selectedProduct?.name}
                          {product.color && (
                            <>
                              , {tFields('color')}:
                              <span className="ml-1 inline-flex items-center align-middle">
                                <div
                                  className="mr-1 h-4 w-4 rounded-full border border-border align-middle"
                                  style={{
                                    backgroundColor: colorHexMap[product.color as keyof typeof colorHexMap],
                                  }}></div>
                                <span className="align-middle">{tColors(product.color)}</span>
                              </span>
                            </>
                          )}
                          {product.size && `, ${tFields('size')}: ${product.size}`}
                        </span>
                        <span>
                          {isNaN(parseFloat(product.detailPrice) * parseFloat(product.quantity))
                            ? 0
                            : parseFloat(product.detailPrice) * parseFloat(product.quantity)}{' '}
                          TND
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex w-full items-center justify-between font-medium">
                    <p>{tFields('delivery-fee')}</p>
                    <p>{deliveryFee} TND</p>
                  </div>
                  <div className="mb-1 mt-3 h-[1px] w-full rounded-md bg-border " />
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>TOTAL</p>
                    <p>{total.toFixed(2)} TND</p>
                  </div>
                  {role === roleOptions.ADMIN && (
                    <div className="flex w-full items-center justify-between font-semibold">
                      <p>{tFields('platform-profit')}</p>
                      <p>{platformProfit.toFixed(2)} TND</p>
                    </div>
                  )}
                  {role === roleOptions.SELLER && (
                    <div className="flex w-full items-center justify-between font-semibold">
                      <p>{tFields('platform-profit')} (10%)</p>
                      <p>{(sellerProfit / 9).toFixed(2)} TND</p>
                    </div>
                  )}

                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('seller-profit')}</p>
                    <p className="text-primary">{sellerProfit.toFixed(2)} TND</p>
                  </div>
                </div>
              )}

              {errors.products && (
                <div className="flex w-full items-center space-x-4 rounded-md border border-destructive bg-background p-2">
                  <IconExclamationCircle className="h-10 w-10  text-destructive" />
                  <h1 className="text-sm text-destructive">{tValidation('order-products-error')}</h1>
                </div>
              )}
            </div>
          </LabelInputContainer>
          {isComposedOrder && (
            <div className="mt-4 flex animate-pulse items-center justify-center px-2 text-sm font-medium text-muted-foreground">
              {t('composed-order')}
            </div>
          )}
        </div>
        <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-4">
          <Button type="submit" className="h-12" size="default" disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
            {t('save-button')}
          </Button>
        </div>
      </form>
    </div>
  );
}
