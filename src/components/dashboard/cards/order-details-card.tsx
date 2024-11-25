'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { colorHexMap, MEDIA_HOSTNAME, orderStatuses, roleOptions } from '@/lib/constants';
import { ActionResponse, MediaType } from '@/types';
import { Order, OrderProduct, Pickup, Product, StatusHistory, SubOrder, User } from '@prisma/client';
import {
  IconCurrentLocation,
  IconFileInfo,
  IconHistory,
  IconInfoCircleFilled,
  IconLoader2,
  IconRefresh,
  IconTicket,
  IconShoppingCartOff,
  IconUser,
  IconUserSquare,
  IconTruckDelivery,
  IconExchange,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { CancelOrderDialog } from '../dialogs/cancel-order-dialog';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from '@/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { StatusHistoryDialog } from '../dialogs/status-history-dialog';

interface OrderDetailsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  order: Order & {
    seller?: User;
    subOrders: (SubOrder & {
      pickup: Pickup;
      products: (OrderProduct & { product: Product & { supplier: User; media: MediaType[] } })[];
      statusHistory: StatusHistory[];
    })[];
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

  const subOrderStatuses = order.subOrders.map((subOrder) => subOrder.status);

  const isOrderCancellable = subOrderStatuses.every((status) => status === 'EC00');

  const subOrders =
    role === roleOptions.SUPPLIER
      ? order.subOrders.filter((p) => p.products[0].product.supplierId === user?.id)
      : order.subOrders;

  const platformProfit = (() => {
    switch (role) {
      case roleOptions.SELLER:
        return (order.subOrders.reduce((totalProfit, subOrder) => totalProfit + subOrder.sellerProfit!, 0) / 0.9) * 0.1;
      case roleOptions.SUPPLIER:
        return subOrders[0].products.reduce((total, orderProduct) => {
          return total + (orderProduct.product.platformProfit ?? 0) * parseInt(orderProduct.quantity);
        }, 0);
      case roleOptions.ADMIN:
        return order.subOrders.reduce((totalProfit, subOrder) => totalProfit + subOrder.platformProfit!, 0);

      default:
        return 0;
    }
  })();

  const deliveryFee =
    user?.role === roleOptions.SUPPLIER
      ? order.subOrders.length > 1
        ? 7
        : 8
      : order.subOrders.length > 1
        ? order.subOrders.length * 7
        : 8;

  const [isPrintLoading, startPrintTransition] = useTransition();
  const [isCancelLoading, startCancelTransition] = useTransition();
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setHistoryDialogOpen] = useState(false);
  const [isRefreshLoading, setRefreshLoading] = useState(false);
  const [selectedSubOrder, setSelectedSubOrder] = useState(order.subOrders[0]);

  const handleCancelOrder = async () => {
    startCancelTransition(async () => {
      if (isOrderCancellable && onCancel) {
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

  const handlePrintLabel = async (subOrderId: string) => {
    startPrintTransition(async () => {
      if (onPrintLabel) {
        const res = await onPrintLabel(subOrderId);
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });

          const bytes = new Uint8Array(res.data);
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const docUrl = URL.createObjectURL(blob);
          window.open(docUrl, '_blank');
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
        deliveryId={order.code!}
      />

      <StatusHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        deliveryId={selectedSubOrder.deliveryId!}
        statusHistory={selectedSubOrder.statusHistory}
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
                      disabled={!isOrderCancellable}>
                      <IconShoppingCartOff className="mr-0 h-5 w-5 md:mr-2 " />
                      <p className="hidden md:flex">{t('order-cancel')}</p>
                    </Button>
                  )}
                </div>
              </div>
              {role === roleOptions.ADMIN && (
                <>
                  <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                    <p className="text-muted-foreground">{tFields('order-code')} :</p>
                    <p>{order.code}</p>
                  </div>
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
                </>
              )}
              <div className="my-4 flex flex-col gap-8">
                {subOrders.map((subOrder, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="mx-auto my-4 h-[0.8px] w-[60%] rounded-md bg-border " />

                    <div className="w-ful flex flex-row justify-between">
                      <div className="flex flex-col gap-4">
                        <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                          <p className="text-lg font-medium text-foreground">
                            {tFields('order-sub-order')} {index + 1} :
                          </p>
                        </div>
                        <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                          <p className="text-muted-foreground">{tFields('order-code')} :</p>
                          <p>{subOrder.code}</p>
                        </div>
                        <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                          <p className="text-muted-foreground">{tFields('order-delivery-id')} :</p>
                          <p>{subOrder.deliveryId ?? 'N/A'}</p>
                        </div>
                        {(role === roleOptions.ADMIN || role === roleOptions.SUPPLIER) && (
                          <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                            <p className="text-muted-foreground">{tFields('order-pickup')} :</p>
                            <p>{subOrder.pickup ? subOrder.pickup.code : 'N/A'}</p>
                          </div>
                        )}
                        {role === roleOptions.ADMIN && (
                          <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                            <p className="text-muted-foreground">{tFields('order-supplier')} :</p>
                            <div className="flex flex-row items-center gap-x-3">
                              <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage
                                  className="object-cover"
                                  src={`${MEDIA_HOSTNAME}${subOrder.products[0].product.supplier?.image}`}
                                  alt={subOrder.products[0].product.supplier?.fullName ?? ''}
                                />
                                <AvatarFallback className="text-md">
                                  <IconUser className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              {subOrder.products[0].product.supplier?.fullName}
                            </div>
                          </div>
                        )}
                      </div>
                      {(role === roleOptions.ADMIN || role === roleOptions.SUPPLIER) && (
                        <Button
                          className=" px-3"
                          onClick={(event) => {
                            event.preventDefault();
                            handlePrintLabel(subOrder.id);
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
                    {subOrder.products.map((orderProduct, index) => (
                      <div key={index} className="flex flex-col items-center gap-4 md:flex-row md:gap-6 ">
                        {/* Product Image */}
                        <Image
                          className="rounded-md object-contain"
                          src={`${MEDIA_HOSTNAME}${orderProduct.product.media[0].key}`}
                          alt={orderProduct.product.name}
                          height={180}
                          width={180}
                        />
                        <div className="flex h-full w-full items-center justify-between">
                          <div className="items-between flex h-full w-full flex-col justify-between gap-4 py-2 text-sm ">
                            <p className="flex max-w-full text-[1.1rem] font-medium md:max-w-[50%]">
                              {orderProduct.product.name}
                            </p>
                            <div className="flex flex-col gap-2">
                              {role === roleOptions.ADMIN && (
                                <span className="font-medium text-muted-foreground">
                                  {tFields('order-product-code')} :{' '}
                                  <span className="text-foreground">{orderProduct.code}</span>
                                </span>
                              )}
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
                              {role === roleOptions.SELLER && (
                                <span className="font-medium text-muted-foreground">
                                  {tFields('seller-profit-unit')} :{' '}
                                  <span className="text-foreground">
                                    {(orderProduct.detailPrice - orderProduct.product.wholesalePrice).toFixed(1)} TND
                                  </span>
                                </span>
                              )}
                              {role === roleOptions.SUPPLIER && (
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
                                <span className="font-medium text-muted-foreground">
                                  {tFields('product-size')} :{' '}
                                  <span className="text-foreground">{orderProduct.size}</span>
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

                    <div className="flex flex-col gap-2 text-sm">
                      {role !== roleOptions.SUPPLIER && (
                        <div className="flex w-full items-center justify-between pt-3 font-medium">
                          <p>{tFields('delivery-fee')}</p>
                          <p>{deliveryFee / order.subOrders.length} TND</p>
                        </div>
                      )}
                      {role !== roleOptions.SUPPLIER && (
                        <div className="flex w-full items-center justify-between font-medium">
                          <p>{tFields('order-sub-order-total')}</p>
                          <p>{subOrder.total} TND</p>
                        </div>
                      )}
                      {role === roleOptions.ADMIN && (
                        <div className="flex w-full items-center justify-between font-medium">
                          <p>{tFields('supplier-profit')}</p>
                          <p className="text-primary">
                            {subOrder.products
                              .reduce((total, orderProduct) => {
                                return total + (orderProduct.supplierProfit || 0);
                              }, 0)
                              .toFixed(1)}{' '}
                            TND
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-md flex flex-col items-center justify-center gap-2 ">
                <div className="my-6 h-[1px] w-full rounded-md bg-border " />
                <div className="flex w-full items-center justify-between pt-3 font-semibold">
                  <p>{tFields('delivery-fee-total')}</p>
                  <p>{deliveryFee} TND</p>
                </div>
                {(role === roleOptions.SELLER || role === roleOptions.ADMIN) && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>TOTAL</p>
                    <p>{order.total.toFixed(1)} TND</p>
                  </div>
                )}
                {role === roleOptions.SUPPLIER && (
                  <div className="flex w-full items-center justify-between font-medium">
                    <p>TOTAL</p>
                    <p>{subOrders[0].total} TND</p>
                  </div>
                )}
                <div className="flex w-full items-center justify-between font-semibold">
                  <p>{tFields('platform-profit')} (10%)</p>
                  <p>{platformProfit.toFixed(1)} TND</p>
                </div>

                {role === roleOptions.SUPPLIER && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('supplier-profit')}</p>
                    <p className="text-primary">
                      {subOrders[0].products
                        .reduce((total, orderProduct) => {
                          return total + (orderProduct.supplierProfit || 0);
                        }, 0)
                        .toFixed(1)}{' '}
                      TND
                    </p>
                  </div>
                )}
                {(role === roleOptions.SELLER || role === roleOptions.ADMIN) && (
                  <div className="flex w-full items-center justify-between font-semibold">
                    <p>{tFields('seller-profit')}</p>
                    <p className="text-primary">
                      {order.subOrders
                        .reduce((total, subOrder) => {
                          return total + subOrder.sellerProfit!;
                        }, 0)
                        .toFixed(1)}{' '}
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
              {subOrders.map((subOrder, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="flex w-full items-center justify-between gap-2 text-sm font-medium">
                    <p className="text-md font-medium text-foreground">
                      {tFields('order-sub-order')} {index + 1} :
                    </p>
                    <Button
                      className="h-8"
                      onClick={(event) => {
                        setSelectedSubOrder(subOrder);
                        setHistoryDialogOpen(true);
                      }}
                      variant={'outline'}
                      size={'sm'}>
                      <IconHistory className={cn('mr-2 h-4 w-4')} />
                      {t('view-history')}
                    </Button>
                  </div>
                  <div className="flex w-full items-center justify-start gap-2 text-sm font-medium">
                    <p className="text-muted-foreground">{tFields('order-code')} :</p>
                    <p>{subOrder.code}</p>
                  </div>
                  {(() => {
                    const orderStatus = orderStatuses.find((s) => s.UpdateCode === subOrder.status) ?? {
                      UpdateCode: 'EC03',
                      Color: 'text-white bg-gray-300',
                    };
                    return (
                      <div
                        key={index}
                        className={`duration-&lsqb;1100ms&rsqb; mx-auto inline-flex animate-pulse rounded-full px-3 py-1 text-sm ${orderStatus.Color}`}>
                        {tStatuses(orderStatus.UpdateCode)}
                      </div>
                    );
                  })()}
                </div>
              ))}

              <div className="flex flex-row items-center justify-center gap-3">
                <Button
                  className="w-full"
                  onClick={(event) => {
                    event.preventDefault();
                    setRefreshLoading(true);
                    router.refresh();
                    setTimeout(() => setRefreshLoading(false), 2000);
                  }}
                  disabled={isRefreshLoading ? true : false}
                  size={'sm'}
                  variant={'primary'}>
                  <IconRefresh className={cn(isRefreshLoading ? 'animate-spin' : '', 'mr-2 h-5 w-5')} />
                  {t('refresh')}
                </Button>
              </div>
            </div>
            <div className="flex h-min flex-col gap-6 rounded-md border border-border bg-background p-4 md:p-6">
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
                <span className="font-medium text-muted-foreground">
                  {tFields('order-state')} : <span className="text-foreground">{order.state}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
