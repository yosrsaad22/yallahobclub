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
  | 'boarded'
  | 'CIN1'
  | 'CIN2'
> & { role: roleOptions };

export type DataTableHandlers = {
  onDelete: (id: string) => Promise<ActionResponse>;
  onBulkDelete: (ids: string[]) => Promise<ActionResponse>;
  onRequestPickup: (ids: string[]) => Promise<ActionResponse>;
  onPrintPickups: (ids: string[]) => Promise<ActionResponse>;
  onAddTransaction: (userId: string, amount: string) => Promise<ActionResponse>;
  onMarkAsPaid: (ids: string[]) => Promise<ActionResponse>;
  onPrintLabels: (ids: string[]) => Promise<ActionResponse>;
  onCustomRefresh: () => Promise<ActionResponse>;
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

export type TopFiftyItem = {
  id: string;
  name: string;
  media: string;
  totalQuantity: number;
};

export type AdminStats = {
  leads: number;
  subOrders: number;
  platformProfit: number;
  courseProfit: number;
  transactions: number;
  sellers: number;
  suppliers: number;
  products: number;
  cap: number;
  car: number;
  cae: number;
  pickups: number;
  completedSubOrders: number;
  pendingSubOrders: number;
  returnedSubOrders: number;
  paidSubOrders: number;
  cancelledSubOrders: number;
  pendingRevenue: number;
  cancelledRevenue: number;
  returnedRevenue: number;
  monthlyProfit: MonthlyProfit[];
  dailyProfit: DailyProfit[];
  topFiftyProducts: TopFiftyItem[];
  topFiftySellers: TopFiftyItem[];
};

export type SellerStats = {
  cap: number;
  car: number;
  returnedRevenue: number;
  cancelledRevenue: number;
  subOrders: number;
  transactions: number;
  products: number;
  sellersProfit: number;
  pickups: number;
  completedSubOrders: number;
  pendingSubOrders: number;
  cancelledSubOrders: number;
  returnedSubOrders: number;
  paidSubOrders: number;
  paidOrdersProfit: number;
  deliveredNotPaidProfit: number;
  loss: number;
  monthlyProfitAndSubOrders: MonthlyProfitAndSubOrders[];
  dailyProfitAndSubOrders: DailyProfitAndSubOrders[];
  topFiftyProducts: TopFiftyItem[];
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
  topFiftyProducts: TopFiftyItem[];
};
