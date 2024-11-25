'use client';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { User, WithdrawRequest } from '@prisma/client';
import { useRouter } from '@/navigation';
import { cn, formatDate } from '@/lib/utils';
import { ActionResponse, DataTableUser } from '@/types';
import {
  IconReceipt,
  IconUser,
  IconCheck,
  IconX,
  IconCircleCheck,
  IconCircleX,
  IconRefresh,
  IconClockDollar,
  IconMinimize,
  IconMaximize,
  IconArrowsMinimize,
  IconArrowsMaximize,
} from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { MEDIA_HOSTNAME, roleOptions } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddWithdrawRequestDialog } from '../dialogs/add-withdraw-request-dialog';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { ConfirmWithdrawRequestActionDialog } from '../dialogs/confirm-withdraw-request-action-dialog';

interface WithdrawRequestsProps {
  requests: (WithdrawRequest & { user: User })[];
  onCreateWithdrawRequest?: (data: any) => Promise<ActionResponse>;
  onApproveWithdrawRequest?: (id: string) => Promise<ActionResponse>;
  onDeclineWithdrawRequest?: (id: string) => Promise<ActionResponse>;
}

export const WithdrawRequestsCard: React.FC<WithdrawRequestsProps> = ({
  requests,
  onCreateWithdrawRequest,
  onApproveWithdrawRequest,
  onDeclineWithdrawRequest,
}) => {
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    actionType: 'approve' | 'decline';
    amount: number | string;
    userName: string;
    requestId: string;
  } | null>(null);

  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    if (!searchTerm) return requests;
    const lowerSearch = searchTerm.toLowerCase();

    return requests.filter((request) => {
      const { createdAt, amount, status, user: requestUser } = request;
      const formattedDate = formatDate(createdAt).toLowerCase();
      const userName = requestUser.fullName.toLowerCase();
      const amountStr = amount.toString().toLowerCase();
      const statusStr = tFields(status).toLowerCase();

      // Base matching criteria
      let matches =
        formattedDate.includes(lowerSearch) ||
        amountStr.includes(lowerSearch) ||
        statusStr.includes(lowerSearch) ||
        userName.includes(lowerSearch);

      // If current user is admin, include additional user fields
      if (user?.role === roleOptions.ADMIN) {
        const userEmail = requestUser.email.toLowerCase();
        const userNumber = requestUser.number.toLowerCase();
        const userCode = requestUser.code.toLowerCase();

        matches =
          matches ||
          userEmail.includes(lowerSearch) ||
          userNumber.includes(lowerSearch) ||
          userCode.includes(lowerSearch);
      }

      return matches;
    });
  }, [searchTerm, requests, tFields, user]);

  const handleApprove = async () => {
    if (!actionDialog || !onApproveWithdrawRequest) return;
    const { requestId, amount, userName } = actionDialog;
    setLoadingActionId(requestId);
    try {
      const res = await onApproveWithdrawRequest(requestId);
      if (res.success) {
        toast({
          variant: 'success',
          title: tValidation('success-title'),
          description: tValidation(res.success),
        });
        // Optionally, refresh the requests or update state here
      } else {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation(res.error),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation('withdraw-request-approved-error'),
      });
    } finally {
      setLoadingActionId(null);
      setActionDialog(null);
    }
  };

  // Handle Decline Action
  const handleDecline = async () => {
    if (!actionDialog || !onDeclineWithdrawRequest) return;
    const { requestId, amount, userName } = actionDialog;
    setLoadingActionId(requestId);
    try {
      const res = await onDeclineWithdrawRequest(requestId);
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
    } catch (error) {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation('withdraw-request-declined-error'),
      });
    } finally {
      setLoadingActionId(null);
      setActionDialog(null);
    }
  };

  // Handle Create Withdraw Request
  const handleCreateWithdrawRequest = async (data: any) => {
    if (!onCreateWithdrawRequest) return;
    onCreateWithdrawRequest(data).then((res: ActionResponse) => {
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
      return res;
    });
  };

  // UserCell Component
  const UserCell = ({ user }: { user: User }) => {
    return (
      <div className="flex flex-row items-center gap-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${user.image}`} alt={user.fullName[0] ?? ''} />
          <AvatarFallback>
            {' '}
            <IconUser className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex h-[2.5rem] max-w-[100px] items-center overflow-hidden">
          <p
            className="overflow-hidden text-ellipsis break-words"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
            {user.fullName}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {onCreateWithdrawRequest && user?.role !== roleOptions.ADMIN && (
        <AddWithdrawRequestDialog
          onWithdrawRequestAdd={handleCreateWithdrawRequest}
          isOpen={isWithdrawDialogOpen}
          onClose={() => setWithdrawDialogOpen(false)}
        />
      )}

      {actionDialog && user?.role === roleOptions.ADMIN && (
        <ConfirmWithdrawRequestActionDialog
          isOpen={actionDialog.isOpen}
          onClose={() => setActionDialog(null)}
          onConfirm={actionDialog.actionType === 'approve' ? handleApprove : handleDecline}
          isLoading={loadingActionId === actionDialog.requestId}
          actionType={actionDialog.actionType}
          amount={actionDialog.amount}
          userName={actionDialog.userName}
        />
      )}

      {/* Withdraw Requests Card */}
      <div className={cn('flex w-full flex-col gap-4 rounded-md border border-border bg-background p-4 py-4')}>
        {/* Header Section */}
        <div className="flex flex-col gap-2 ">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <IconClockDollar className="h-6 w-6" />
            {t('withdraw-requests')}
          </h3>

          {/* Note */}
          {user?.role !== roleOptions.ADMIN && <p className="text-sm text-muted-foreground">{t('withdraw-note')}</p>}
        </div>

        {/* Search Bar */}
        <div className="flex w-full items-center justify-between">
          <Input
            placeholder={t('search')}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 w-[40%]"
          />
          <div className="flex items-center gap-2">
            {user?.role !== roleOptions.ADMIN && (
              <Button onClick={() => setWithdrawDialogOpen(true)} className="">
                <IconReceipt className="mr-0 h-5 w-5 md:mr-2" />
                {t('request-withdraw')}
              </Button>
            )}
            <Button
              onClick={() => {
                setIsRefreshing(true);
                router.refresh();
                setTimeout(() => {
                  setIsRefreshing(false);
                }, 1000);
              }}
              className=" relative"
              variant={'outline'}
              size={'icon'}>
              <IconRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button size={'icon'} variant={'outline'} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <IconArrowsMinimize className="h-5 w-5" /> : <IconArrowsMaximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <div className="rounded-md border border-border">
          {/* Table Headers */}
          <div className="flex items-center justify-between overflow-auto border-b border-border bg-background p-3 px-8 text-muted-foreground">
            <div className="w-1/4 text-center">
              <p className="text-sm font-semibold">{tFields('withdraw-created-at')}</p>
            </div>
            <div className="w-1/4 text-center">
              <p className="text-sm font-semibold">{tFields('withdraw-amount')}</p>
            </div>
            <div className="w-1/4 text-center">
              <p className="text-sm font-semibold">{tFields('withdraw-status')}</p>
            </div>
            {user?.role === roleOptions.ADMIN && (
              <>
                <div className="w-1/4 text-center">
                  <p className="text-sm font-semibold">{tFields('withdraw-user')}</p>
                </div>
                <div className="w-1/4 text-center">
                  <p className="text-sm font-semibold">Actions</p>
                </div>
              </>
            )}
          </div>

          {/* Table Body */}
          {filteredRequests.length === 0 ? (
            <div className="flex h-24 w-full items-center justify-center">
              <p className="text-sm text-muted-foreground">{t('no-result')}</p>
            </div>
          ) : (
            <div
              className={`flex flex-col ${isExpanded ? 'max-h-96' : 'max-h-48'} custom-scrollbar overflow-auto transition-all duration-300 ease-in-out`}>
              {filteredRequests.map((request, index) => (
                <div
                  key={request.id}
                  className={cn(
                    'flex items-center justify-between bg-background p-2 px-6',
                    index !== filteredRequests.length - 1 && 'border-b border-border',
                  )}>
                  {/* Created At */}
                  <div className="w-1/4 text-center">
                    <p className="text-sm">{formatDate(request.createdAt)}</p>
                  </div>
                  {/* Amount */}
                  <div className="w-1/4 text-center font-semibold">
                    <p className="text-sm">{request.amount} TND</p>
                  </div>
                  {/* Status */}
                  <div className="w-1/4 text-center">
                    <div
                      className={`inline-flex rounded-full px-3 py-1 text-sm text-white ${
                        request.status === 'pending'
                          ? 'bg-blue-300'
                          : request.status === 'declined'
                            ? 'bg-destructive'
                            : 'bg-success'
                      }`}>
                      {tFields(request.status)}
                    </div>
                  </div>
                  {/* User - Admin Only */}
                  {user?.role === roleOptions.ADMIN && (
                    <>
                      <div className="w-1/4 text-center">
                        <UserCell user={request.user} />
                      </div>
                      {/* Actions - Admin Only */}
                      <div className="flex w-1/4 justify-center space-x-2">
                        {onApproveWithdrawRequest && (
                          <Button
                            size="sm"
                            className="text-sm"
                            variant="outline"
                            disabled={request.status !== 'pending'}
                            onClick={() =>
                              setActionDialog({
                                isOpen: true,
                                actionType: 'approve',
                                amount: request.amount,
                                userName: request.user.fullName,
                                requestId: request.id,
                              })
                            }
                            aria-label="Approve Withdraw Request">
                            <IconCircleCheck className="mr-2 h-6 w-6 text-success" />
                            {t('approve')}
                          </Button>
                        )}
                        {onDeclineWithdrawRequest && (
                          <Button
                            size="sm"
                            className="text-sm"
                            variant="outline"
                            disabled={request.status !== 'pending'}
                            onClick={() =>
                              setActionDialog({
                                isOpen: true,
                                actionType: 'decline',
                                amount: request.amount,
                                userName: request.user.fullName,
                                requestId: request.id,
                              })
                            }
                            aria-label="Decline Withdraw Request">
                            <IconCircleX className="mr-2 h-6 w-6 text-destructive" />
                            {t('decline')}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
