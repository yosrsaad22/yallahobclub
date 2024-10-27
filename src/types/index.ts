import { colorOptions, roleOptions, sizeOptions } from '@/lib/constants';
import { Lead, User } from '@prisma/client';

export type ActionResponse = {
  error?: string;
  success?: string;
  data?: any;
};

export type NavItem = {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  notificationsCount?: number;
};

export type NavItemWithChildren = NavItem & {
  items: NavItemWithChildren[];
};

export type NavItemWithOptionalChildren = NavItem & {
  items?: NavItemWithChildren[];
};

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type DataTableLead = Pick<
  Lead,
  'id' | 'fullName' | 'email' | 'number' | 'videoProgress' | 'enrollNumber' | 'createdAt'
>;

export type DataTableUser = Pick<
  User,
  | 'id'
  | 'fullName'
  | 'email'
  | 'emailVerified'
  | 'number'
  | 'address'
  | 'active'
  | 'paid'
  | 'pack'
  | 'rib'
  | 'createdAt'
  | 'image'
> & { role: roleOptions };

export type DataTableHandlers = {
  onDelete: (id: string) => Promise<ActionResponse>;
  onBulkDelete: (ids: string[]) => Promise<ActionResponse>;
  onRequestPickup: (ids: string[]) => Promise<ActionResponse>;
};

export type MediaType = {
  key: string;
  type: string;
};

export type OrderStatusType = {
  UpdateCode: string;
  Key: string;
  Color: string;
};

export type OrderProduct = {
  productId: string;
  quantity: string;
  detailPrice: string;
  supplierProfit: number;
  size?: string;
  color?: string;
};
