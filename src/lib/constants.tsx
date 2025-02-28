import { NavItem, OrderStatusType } from '@/types';
import {
  IconBoxSeam,
  IconBrandYoutube,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCurrentLocation,
  IconLayoutDashboard,
  IconNotebook,
  IconPackage,
  IconPackageExport,
  IconPackageOff,
  IconReceipt2,
  IconSettings,
  IconShoppingCart,
  IconTruckDelivery,
  IconTruckLoading,
  IconShoppingCartOff,
  IconUser,
  IconUserPlus,
  IconUserQuestion,
  IconUsers,
  IconCoin,
  IconCoinOff,
  IconClockDollar,
  IconId,
  IconFileCheck,
  IconAffiliate,
} from '@tabler/icons-react';

export enum packOptions {
  FREE = 'FREE',
  DAMREJ = 'DAMREJ',
  AJEJA = 'AJEJA',
  BRAND = 'BRAND',
  MACHROU3 = 'MACHROU3',
}

export enum roleOptions {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  SUPPLIER = 'SUPPLIER',
}

export enum secureRoleOptions {
  SELLER = 'SELLER',
  SUPPLIER = 'SUPPLIER',
}

export const adminNavItems: NavItem[] = [
  {
    title: 'dashboard',
    href: '/dashboard/admin',
    icon: <IconLayoutDashboard />,
  },
  {
    title: 'marketplace',
    href: '/dashboard/marketplace',
    icon: <IconBuildingStore />,
  },
  {
    title: 'leads',
    href: '/dashboard/admin/leads',
    icon: <IconUserQuestion />,
  },
  {
    title: 'course',
    href: '/dashboard/admin/course',
    icon: <IconBrandYoutube />,
  },
  {
    title: 'sellers',
    href: '/dashboard/admin/sellers',
    icon: <IconUsers />,
  },
  {
    title: 'suppliers',
    href: '/dashboard/admin/suppliers',
    icon: <IconBuildingWarehouse />,
  },
  {
    title: 'products',
    href: '/dashboard/admin/products',
    icon: <IconBoxSeam />,
  },
  {
    title: 'orders',
    href: '/dashboard/admin/orders',
    icon: <IconShoppingCart />,
  },
  {
    title: 'pickups',
    href: '/dashboard/admin/pickups',
    icon: <IconTruckDelivery />,
  },
  {
    title: 'transactions',
    href: '/dashboard/admin/transactions',
    icon: <IconReceipt2 />,
  },
  {
    title: 'settings',
    href: '/dashboard/admin/settings',
    icon: <IconSettings />,
  },
];

export const sellerNavItems: NavItem[] = [
  {
    title: 'dashboard',
    href: '/dashboard/seller',
    icon: <IconLayoutDashboard />,
  },
  {
    title: 'marketplace',
    href: '/dashboard/marketplace',
    icon: <IconBuildingStore />,
  },
  {
    title: 'course',
    href: '/dashboard/seller/course',
    icon: <IconBrandYoutube />,
  },
  {
    title: 'my-products',
    href: '/dashboard/seller/my-products',
    icon: <IconBoxSeam />,
  },
  {
    title: 'orders',
    href: '/dashboard/seller/orders',
    icon: <IconShoppingCart />,
  },
  {
    title: 'transactions',
    href: '/dashboard/seller/transactions',
    icon: <IconReceipt2 />,
  },
  {
    title: 'integrations',
    href: '/dashboard/seller/integrations',
    icon: <IconAffiliate />,
    comingSoon: true,
  },
  {
    title: 'settings',
    href: '/dashboard/seller/settings',
    icon: <IconSettings />,
  },
];

export const supplierNavItems: NavItem[] = [
  {
    title: 'dashboard',
    href: '/dashboard/supplier',
    icon: <IconLayoutDashboard />,
  },
  {
    title: 'products',
    href: '/dashboard/supplier/products',
    icon: <IconBoxSeam />,
  },
  {
    title: 'orders',
    href: '/dashboard/supplier/orders',
    icon: <IconShoppingCart />,
  },
  {
    title: 'pickups',
    href: '/dashboard/supplier/pickups',
    icon: <IconTruckDelivery />,
  },
  {
    title: 'transactions',
    href: '/dashboard/supplier/transactions',
    icon: <IconReceipt2 />,
  },
  {
    title: 'settings',
    href: '/dashboard/supplier/settings',
    icon: <IconSettings />,
  },
];

export const MEDIA_HOSTNAME = 'https://utfs.io/f/';

export const notificationIcons = {
  ADMIN_NEW_PRODUCT: IconPackage,
  ADMIN_NEW_SELLER: IconUserPlus,
  ADMIN_NEW_SUPPLIER: IconBuildingWarehouse,
  ADMIN_NEW_LEAD: IconUserQuestion,
  SUPPLIER_PRODUCT_PUBLISHED: IconPackageExport,
  SUPPLIER_PRODUCT_UNPUBLISHED: IconPackageOff,
  SUPPLIER_NEW_ORDER: IconShoppingCart,
  ADMIN_NEW_ORDER: IconShoppingCart,
  SELLER_STOCK_CHANGED: IconTruckLoading,
  ORDER_STATUS_CHANGED: IconCurrentLocation,
  ORDER_CANCELLED: IconShoppingCartOff,
  NEW_PICKUP: IconTruckDelivery,
  NEW_TRANSACTION: IconReceipt2,
  NEW_WITHDRAW_REQUEST: IconClockDollar,
  WITHDRAW_REQUEST_APPROVED: IconCoin,
  WITHDRAW_REQUEST_DENIED: IconCoinOff,
  ADMIN_NEW_ON_BOARDING: IconId,
  DOCUMENTS_APPROVED: IconFileCheck,
};

export const notificationMessages = {
  ADMIN_NEW_PRODUCT: 'admin-new-product',
  ADMIN_NEW_SELLER: 'admin-new-seller',
  ADMIN_NEW_SUPPLIER: 'admin-new-supplier',
  ADMIN_NEW_LEAD: 'admin-new-lead',
  SUPPLIER_PRODUCT_PUBLISHED: 'supplier-product-published',
  SUPPLIER_PRODUCT_UNPUBLISHED: 'supplier-product-unpublished',
  SUPPLIER_NEW_ORDER: 'supplier-new-order',
  ADMIN_NEW_ORDER: 'admin-new-order',
  SELLER_STOCK_CHANGED: 'seller-stock-changed',
  ORDER_STATUS_CHANGED: 'order-status-changed',
  ORDER_CANCELLED: 'order-cancelled',
  NEW_PICKUP: 'new-pickup',
  NEW_TRANSACTION: 'new-transaction',
  NEW_WITHDRAW_REQUEST: 'new-withdraw-request',
  WITHDRAW_REQUEST_APPROVED: 'withdraw-request-approved',
  WITHDRAW_REQUEST_DENIED: 'withdraw-request-declined',
  ADMIN_NEW_ON_BOARDING: 'admin-new-on-boarding',
  DOCUMENTS_APPROVED: 'documents-approved',
};

export const localeOptions = {
  EN: 'en',
  FR: 'fr',
};

export const DEFAULT_PASSWORD = 'ECOMNESS2024';

export enum productCategoryOptions {
  FURNITURE = 'FURNITURE',
  ACCESSORIES = 'ACCESSORIES',
  KITCHEN = 'KITCHEN',
  DECORATION = 'DECORATION',
  CAR_ACCESSORIES = 'CAR_ACCESSORIES',
  HOME_APPLIANCES = 'HOME_APPLIANCES',
  ELECTRONICS = 'ELECTRONICS',
  CLOTHING = 'CLOTHING',
  BEAUTY = 'BEAUTY',
  SPORTS = 'SPORTS',
  TOYS = 'TOYS',
  JEWELRY = 'JEWELRY',
  GARDEN = 'GARDEN',
}

export const productCategoryData = [
  {
    name: productCategoryOptions.FURNITURE,
    imageUrl: '/img/furniture.png',
  },
  {
    name: productCategoryOptions.ACCESSORIES,
    imageUrl: '/img/accessories.png',
  },
  {
    name: productCategoryOptions.KITCHEN,
    imageUrl: '/img/kitchen.png',
  },
  {
    name: productCategoryOptions.DECORATION,
    imageUrl: '/img/decoration.png',
  },
  {
    name: productCategoryOptions.TOYS,
    imageUrl: '/img/baby-kids.webp',
  },
  {
    name: productCategoryOptions.HOME_APPLIANCES,
    imageUrl: '/img/appliances.webp',
  },

  {
    name: productCategoryOptions.ELECTRONICS,
    imageUrl: '/img/technology.webp',
  },
  {
    name: productCategoryOptions.CLOTHING,
    imageUrl: '/img/fashion.png',
  },
  {
    name: productCategoryOptions.BEAUTY,
    imageUrl: '/img/beauty.webp',
  },
  {
    name: productCategoryOptions.GARDEN,
    imageUrl: '/img/garden.png',
  },
  {
    name: productCategoryOptions.SPORTS,
    imageUrl: '/img/sport.webp',
  },
  {
    name: productCategoryOptions.CAR_ACCESSORIES,
    imageUrl: '/img/auto-parts.webp',
  },
  {
    name: productCategoryOptions.JEWELRY,
    imageUrl: '/img/jewelry.png',
  },
];

export enum sizeOptions {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

export enum colorOptions {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  PINK = 'PINK',
  LIGH_PINK = 'LIGHT_PINK',
  LIGHT_BLUE = 'LIGHT_BLUE',
  NAVY_BLUE = 'NAVY_BLUE',
  TURQUOISE = 'TURQUOISE',
  BEIGE = 'BEIGE',
  BROWN = 'BROWN',
  GRAY = 'GRAY',
  GOLD = 'GOLD',
  BRONZE = 'BRONZE',
  SALMON_RED = 'SALMON_RED',
  BURGUNDY_RED = 'BURGUNDY_RED',
}

export const colorHexMap: { [key in colorOptions]: string } = {
  [colorOptions.RED]: '#FF0000',
  [colorOptions.BLUE]: '#0000FF',
  [colorOptions.GREEN]: '#00FF00',
  [colorOptions.YELLOW]: '#FFFF00',
  [colorOptions.BLACK]: '#000000',
  [colorOptions.WHITE]: '#FFFFFF',
  [colorOptions.ORANGE]: '#FFA500',
  [colorOptions.PURPLE]: '#800080',
  [colorOptions.LIGH_PINK]: '#F8AEBE',
  [colorOptions.PINK]: '#FA85A0',
  [colorOptions.LIGHT_BLUE]: '#ADD8E6',
  [colorOptions.NAVY_BLUE]: '#000080',
  [colorOptions.TURQUOISE]: '#40E0D0',
  [colorOptions.BEIGE]: '#F5F5DC',
  [colorOptions.BROWN]: '#A52A2A',
  [colorOptions.GRAY]: '#808080',
  [colorOptions.GOLD]: '#FFD700',
  [colorOptions.BRONZE]: '#CD7F32',
  [colorOptions.SALMON_RED]: '#FA8072',
  [colorOptions.BURGUNDY_RED]: '#800020',
};

export const orderStatuses = [
  {
    UpdateCode: 'EC00',
    Color: 'bg-blue-300 text-white',
  },
  {
    UpdateCode: 'EC01',
    Color: 'bg-destructive text-white',
  },
  {
    UpdateCode: 'EC02',
    Color: 'bg-success text-white',
  },
  {
    UpdateCode: 'EC03',
    Color: 'bg-destructive text-white',
  },
  {
    UpdateCode: 'EC04',
    Color: 'bg-gray-300 text-white',
  },
  {
    UpdateCode: '1',
    Color: 'bg-pink-300 text-white',
  },
  {
    UpdateCode: '2',
    Color: 'bg-gray-300 text-white',
  },
  {
    UpdateCode: '3',
    Color: 'bg-green-400 text-white',
  },
  {
    UpdateCode: '4',
    Color: 'bg-blue-200 text-white',
  },
  {
    UpdateCode: '5',
    Color: 'bg-teal-300 text-white',
  },
  {
    UpdateCode: '6',
    Color: 'bg-destructive text-white',
  },
  {
    UpdateCode: '7',
    Color: 'bg-success text-white',
  },
  {
    UpdateCode: '8',
    Color: 'bg-indigo-300 text-white',
  },
  {
    UpdateCode: '17',
    Color: 'bg-indigo-300 text-white',
  },
  {
    UpdateCode: '9',
    Color: 'bg-gray-400 text-white',
  },
  {
    UpdateCode: '10',
    Color: 'bg-teal-300 text-white',
  },
  {
    UpdateCode: '14',
    Color: 'bg-purple-300  text-white',
  },
  {
    UpdateCode: '15',
    Color: 'bg-red-300 text-white',
  },
  {
    UpdateCode: '16',
    Color: 'bg-green-300 text-white',
  },
  {
    UpdateCode: '18',
    Color: 'bg-purple-300 text-white',
  },
  {
    UpdateCode: '19',
    Color: 'bg-destructive text-white',
  },
  {
    UpdateCode: '20',
    Color: 'bg-purple-300  text-white',
  },
  {
    UpdateCode: '21',
    Color: 'bg-success text-white',
  },
  {
    UpdateCode: '22',
    Color: 'bg-success text-white',
  },
  {
    UpdateCode: '23',
    Color: 'bg-success text-white',
  },
  {
    UpdateCode: '24',
    Color: 'bg-blue-300 text-white',
  },
  {
    UpdateCode: '25',
    Color: 'bg-destructive text-white',
  },
  {
    UpdateCode: '26',
    Color: 'bg-success text-white',
  },
  {
    UpdateCode: '27',
    Color: 'bg-purple-300 text-white',
  },
  {
    UpdateCode: '28',
    Color: 'bg-destructive text-white',
  },
  {
    UpdateCode: '29',
    Color: 'bg-indigo-300 text-white',
  },
];

export const states = [
  'Ariana',
  'Béja',
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kébili',
  'La Manouba',
  'Le Kef',
  'Mahdia',
  'Médenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan',
];

export const postalCodes = [
  '2080',
  '9000',
  '2013',
  '7000',
  '6000',
  '2100',
  '8100',
  '3100',
  '1200',
  '4200',
  '2010',
  '7100',
  '5100',
  '4100',
  '5000',
  '8000',
  '3000',
  '9100',
  '6100',
  '4000',
  '3200',
  '2200',
  '1000',
  '1100',
];
