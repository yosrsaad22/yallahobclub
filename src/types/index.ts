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
  | 'code'
  | 'fullName'
  | 'email'
  | 'emailVerified'
  | 'number'
  | 'address'
  | 'city'
  | 'state'
  | 'active'
  | 'paid'
  | 'pack'
  | 'rib'
  | 'balance'
  | 'createdAt'
  | 'image'
  | 'pickupId'
  | 'storeName'
> & { role: roleOptions };

export type DataTableHandlers = {
  onDelete: (id: string) => Promise<ActionResponse>;
  onBulkDelete: (ids: string[]) => Promise<ActionResponse>;
  onRequestPickup: (ids: string[]) => Promise<ActionResponse>;
  onPrintPickup: (id: string) => Promise<ActionResponse>;
  onAddTransaction: (userId: string, amount: string) => Promise<ActionResponse>;
  onMarkAsPaid: (ids: string[]) => Promise<ActionResponse>;
};

export type MediaType = {
  key: string;
  type: string;
};

export type OrderStatusType = {
  UpdateCode: string;
  ProblemCode?: string;
  Key: string;
  Description: string;
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

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type DailyProfitAndSubOrders = {
  date: string;
  subOrders: number;
  profit: number;
};

export type MonthlyProfitAndSubOrders = {
  month: string; // e.g., 'Jan'
  profit: number;
  subOrders: number;
};

export type DailyProfit = {
  date: string;
  subOrders: number;
  profit: number;
  soldCourses: number;
};

export type MonthlyProfit = {
  month: string; // e.g., 'Jan'
  profit: number;
  subOrders: number;
  soldCourses: number;
};

export type TopFiveItem = {
  id: string;
  name: string;
  media: string;
  totalQuantity: number;
};

export type AdminStats = {
  leads: number;
  subOrders: number;
  platformProfit: number;
  transactions: number;
  sellers: number;
  suppliers: number;
  products: number;
  sellersProfit: number;
  pickups: number;
  completedSubOrders: number;
  pendingSubOrders: number;
  returnedSubOrders: number;
  paidSubOrders: number;
  monthlyProfit: MonthlyProfit[];
  dailyProfit: DailyProfit[];
  topFiveProducts: TopFiveItem[];
  topFiveSellers: TopFiveItem[];
};

export type SellerStats = {
  subOrders: number;
  transactions: number;
  products: number;
  sellersProfit: number;
  pickups: number;
  completedSubOrders: number;
  pendingSubOrders: number;
  returnedSubOrders: number;
  paidSubOrders: number;
  monthlyProfitAndSubOrders: MonthlyProfitAndSubOrders[];
  dailyProfitAndSubOrders: DailyProfitAndSubOrders[];
  topFiveProducts: TopFiveItem[];
};

export type SupplierStats = {
  subOrders: number;
  transactions: number;
  products: number;
  sellersProfit: number;
  pickups: number;
  completedSubOrders: number;
  pendingSubOrders: number;
  returnedSubOrders: number;
  paidSubOrders: number;
  monthlyProfitAndSubOrders: MonthlyProfitAndSubOrders[];
  dailyProfitAndSubOrders: DailyProfitAndSubOrders[];
  topFiveProducts: TopFiveItem[];
};
