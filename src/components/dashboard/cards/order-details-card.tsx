'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { colorHexMap, MEDIA_HOSTNAME, orderStatuses, roleOptions } from '@/lib/constants';
import { ActionResponse, MediaType } from '@/types';
import { Order, OrderProduct, Product, User } from '@prisma/client';
import {
  IconCurrentLocation,
  IconFileInfo,
  IconInfoCircleFilled,
  IconLoader2,
  IconTicket,
  IconTruckOff,
  IconUser,
  IconUserSquare,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { CancelOrderDialog } from '../dialogs/cancel-order-dialog';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from '@/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OrderDetailsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  order: Order & {
    products: (OrderProduct & { product: Product & { media: MediaType[] } })[];
    seller?: User;
  };
  onCancel?: (id: string) => Promise<ActionResponse>;
  onPrintLabel?: (id: string) => Promise<ActionResponse>;
}

export default function OrderDetailsCard({ order, onCancel, onPrintLabel }: OrderDetailsCardProps) {
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const tColors = useTranslations('dashboard.colors');
  const user = useCurrentUser();
  const role = user?.role;
  const router = useRouter();

  const tStatuses = useTranslations('dashboard.order-statuses');
  const statusObj = orderStatuses.find((s) => s.Key === order.status) ?? {
    Key: 'n-a',
    Color: 'text-white bg-gray-300',
  };

  const userOrderProducts =
    role === roleOptions.SUPPLIER ? order.products.filter((p) => p.product.supplierId === user?.id) : order.products;
  const [isPrintLoading, startPrintTransition] = useTransition();
  const [isCancelLoading, startCancelTransition] = useTransition();
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelOrder = async () => {
    startCancelTransition(async () => {
      if (order.status === 'record-created' && onCancel) {
        const res = await onCancel(order.id);
        setCancelDialogOpen(false);
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
      } else {
        setCancelDialogOpen(false);
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation('order-uncancelable'),
        });
      }
    });
  };

  const handlePrintLabel = async () => {
    startPrintTransition(async () => {
      if (onPrintLabel) {
        const res = await onPrintLabel(order.id);
        if (res.success) {
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
      }
    });
  };

  return (
    <>
      <CancelOrderDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelOrder}
        isLoading={isCancelLoading}
        deliveryId={order.deliveryId!}
      />
      <div className="flex h-full w-full flex-col items-center gap-8 pt-2">
        <div className="flex w-full items-center space-x-4 rounded-md border border-border bg-background p-2">
          <IconInfoCircleFilled className="h-10 w-10  text-primary" />
          <h1 className="text-sm text-muted-foreground">{t('order-cancel-info')} </h1>
        </div>
        <div className="flex h-full w-full flex-col gap-8 md:flex-row">
          <div className="flex w-full rounded-md  border border-border bg-background p-4 md:w-[70%] md:p-6">
            <div className="flex w-full flex-col gap-3">
              <div className="flex flex-row items-center justify-between">
                <div className="flex w-full flex-col items-start md:flex-row md:items-center">
                  <h2 className="flex items-center gap-2 text-lg font-semibold md:items-center">
                    <IconFileInfo /> {t('order-information')} {'  '}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {(role === roleOptions.ADMIN || role === roleOptions.SELLER) && (
                    <Button
                      className="px-3"
                      onClick={(event) => {
                        event.preventDefault();
                        setCancelDialogOpen(true);
                      }}
                      variant={'destructive'}
                      size={'sm'}
                      disabled={order.status !== 'record-created'}>
                      <IconTruckOff className="mr-0 h-5 w-5 md:mr-2 " />
                      <p className="hidden md:flex">{t('order-cancel')}</p>
                    </Button>
                  )}
                  {(role === roleOptions.ADMIN || role === roleOptions.SUPPLIER) && (
                    <Button
                      className=" px-3"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePrintLabel();
                      }}
                      variant={'primary'}
                      size={'sm'}>
                      {isPrintLoading ? (
                        <IconLoader2 className="mr-0 h-5 w-5 animate-spin md:mr-2 " />
                      ) : (
                        <IconTicket className="mr-0 h-5 w-5 md:mr-2 " />
                      )}
                      <p className="hidden md:flex">{t('print-label')}</p>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                <p className="text-muted-foreground">{tFields('order-delivery-id')} :</p>
                <p>#{order.deliveryId}</p>
              </div>
              {role === roleOptions.ADMIN && (
                <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                  <p className="text-muted-foreground">{tFields('order-seller')} :</p>
                  <div className="flex flex-row items-center gap-x-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        className="object-cover"
                        src={`${MEDIA_HOSTNAME}${order.seller?.image}`}
                        alt={order.seller?.fullName ?? ''}
                      />
                      <AvatarFallback className="text-md">
                        <IconUser className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    {order.seller?.fullName}
                  </div>
                </div>
              )}
              {userOrderProducts.map((orderProduct, index) => (
                <div key={index} className="flex flex-col items-center gap-4 md:flex-row md:gap-6 ">
                  {/* Product Image */}
                  <Image
                    className="rounded-md object-contain"
                    src={`${MEDIA_HOSTNAME}${orderProduct.product.media[0].key}`}
                    alt={orderProduct.product.name}
                    height={170}
                    width={170}
                  />
                  <div className="flex h-full w-full items-center justify-between">
                    <div className="items-between flex h-full w-full flex-col justify-between gap-4 py-2 text-sm ">
                      <p className="flex max-w-full text-[1.1rem] font-medium md:max-w-[50%]">
                        {orderProduct.product.name}
                      </p>
                      <div className="flex flex-col gap-2">
                        <span className="font-medium text-muted-foreground">
                          {tFields('product-quantity')} :{' '}
                          <span className="text-foreground">{orderProduct.quantity}</span>
                        </span>
                        <span className="font-medium text-muted-foreground">
                          {tFields('product-wholesale-price')} :{' '}
                          <span className="text-foreground">{orderProduct.product.wholesalePrice} TND</span>
                        </span>
                        {(role === roleOptions.SELLER || role === roleOptions.ADMIN) && (
                          <span className="font-medium text-muted-foreground">
                            {tFields('product-selling-price')} :{' '}
                            <span className="text-foreground">{orderProduct.detailPrice} TND</span>
                          </span>
                        )}
                        {(role === roleOptions.SELLER || role === roleOptions.ADMIN) && (
                          <span className="font-medium text-muted-foreground">
                            {tFields('seller-profit-unit')} :{' '}
                            <span className="text-foreground">
                              {(orderProduct.detailPrice - orderProduct.product.wholesalePrice).toFixed(1)} TND
                            </span>
                          </span>
                        )}
                        {(role === roleOptions.SUPPLIER || role === roleOptions.ADMIN) && (
                          <span className="font-medium text-muted-foreground">
                            {tFields('supplier-profit-unit')} :{' '}
                            <span className="text-foreground">
                              {orderProduct.product.wholesalePrice.toFixed(1)} TND
                            </span>
                          </span>
                        )}
                        {orderProduct.color && (
                          <span className="font-medium text-muted-foreground">
                            {tFields('product-color')} :{' '}
                            <span className="ml-1 inline-flex items-center align-middle">
                              <div
                                className="mr-1 h-4 w-4 rounded-full border border-border align-middle"
                                style={{
                                  backgroundColor: colorHexMap[orderProduct.color as keyof typeof colorHexMap],
                                }}></div>
                              <span className="align-middle text-foreground">{tColors(orderProduct.color)}</span>
                            </span>
                          </span>
                        )}
                        {orderProduct.size && (
                          <span className="font-semibold text-muted-foreground">
                            {tFields('product-size')} : <span className="text-foreground">{orderProduct.size}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-md whitespace-nowrap pt-[0.6rem] font-medium md:pt-0">
                      {orderProduct.detailPrice * parseFloat(orderProduct.quantity)} TND
                    </p>
                  </div>
                </div>
              ))}
              <div className="text-md flex flex-col items-center justify-center gap-2 ">
                <div className="flex w-full items-center justify-between pt-3 font-medium">
                  <p>{tFields('delivery-fee')}</p>
                  <p>8 TND</p>
                </div>
                <div className="my-4 h-[1px] w-full rounded-md bg-border " />
                {(role === roleOptions.SELLER || role === roleOptions.ADMIN) && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>TOTAL</p>
                    <p>{order.total.toFixed(1)} TND</p>
                  </div>
                )}
                {role === roleOptions.SELLER && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('platform-profit')} (10%)</p>
                    <p>{(order.sellerProfit * 0.1).toFixed(1)} TND</p>
                  </div>
                )}
                {role === roleOptions.SUPPLIER && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('platform-profit')} (10%)</p>
                    <p>
                      {userOrderProducts
                        .reduce((total, orderProduct) => {
                          return total + (orderProduct.product.platformProfit ?? 0) * parseInt(orderProduct.quantity);
                        }, 0)
                        .toFixed(1)}{' '}
                      TND
                    </p>
                  </div>
                )}

                {role === roleOptions.ADMIN && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('platform-profit')}</p>
                    <p>{order.platformProfit.toFixed(1)} TND</p>
                  </div>
                )}

                {(role === roleOptions.SELLER || role === roleOptions.ADMIN) && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('seller-profit')}</p>
                    <p className="text-primary">{order.sellerProfit.toFixed(1)} TND</p>
                  </div>
                )}
                {(role === roleOptions.SUPPLIER || role === roleOptions.ADMIN) && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('supplier-profit')}</p>
                    <p className="text-primary">
                      {userOrderProducts
                        .reduce((total, orderProduct) => {
                          return total + (orderProduct.supplierProfit || 0);
                        }, 0)
                        .toFixed(1)}
                      TND
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-8  md:w-[30%] ">
            <div className="flex flex-col gap-6 rounded-md border border-border bg-background p-4 md:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <IconCurrentLocation /> {t('order-status')} {'  '}
              </h2>
              <p className="text-sm text-muted-foreground">{t('order-status-note')}</p>
              <div
                className={`duration-&lsqb;1100ms&rsqb; mx-auto inline-flex animate-pulse rounded-full px-3 py-1 text-sm ${statusObj.Color}`}>
                {tStatuses(statusObj.Key)}
              </div>
              <Button size={'sm'}>{t('refresh')}</Button>
            </div>
            <div className="flex h-full flex-col gap-6 rounded-md border border-border bg-background p-4 md:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <IconUserSquare /> {t('client-information')} {'  '}
              </h2>{' '}
              <div className="flex flex-col gap-4 text-sm">
                <span className="font-medium text-muted-foreground">
                  {tFields('order-first-name')} : <span className="text-foreground">{order.firstName}</span>
                </span>
                <span className="font-medium text-muted-foreground">
                  {tFields('order-last-name')} : <span className="text-foreground">{order.lastName}</span>
                </span>
                <span className="font-medium text-muted-foreground">
                  {tFields('order-number')} : <span className="text-foreground">{order.number}</span>
                </span>
                {order.email && (
                  <span className="font-medium text-muted-foreground">
                    {tFields('order-email')} : <span className="text-foreground">{order.email}</span>
                  </span>
                )}
                <span className="font-medium text-muted-foreground">
                  {tFields('order-address')} : <span className="text-foreground">{order.address}</span>
                </span>
                <span className="font-medium text-muted-foreground">
                  {tFields('order-city')} : <span className="text-foreground">{order.city}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
