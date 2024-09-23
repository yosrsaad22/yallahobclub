import { NavItem } from '@/types';
import {
  IconBoxSeam,
  IconBrandYoutube,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconLayoutDashboard,
  IconNotebook,
  IconPackage,
  IconReceipt2,
  IconSettings,
  IconTruckDelivery,
  IconUser,
  IconUserPlus,
  IconUserQuestion,
  IconUsers,
} from '@tabler/icons-react';

export enum packOptions {
  DAMREJ = 'DAMREJ',
  AJEJA = 'AJEJA',
  MACHROU3 = 'MACHROU3',
}
export enum roleOptions {
  ADMIN = 'ADMIN',
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
    title: 'orders',
    href: '/dashboard/seller/orders',
    icon: <IconTruckDelivery />,
  },
  {
    title: 'transactions',
    href: '/dashboard/seller/transactions',
    icon: <IconReceipt2 />,
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
    title: 'marketplace',
    href: '/dashboard/marketplace',
    icon: <IconBuildingStore />,
  },
  {
    title: 'products',
    href: '/dashboard/supplier/products',
    icon: <IconBoxSeam />,
  },
  {
    title: 'orders',
    href: '/dashboard/supplier/orders',
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
  ADMIN_NEW_ORDER: IconPackage,
  ADMIN_NEW_SELLER: IconUserPlus,
  ADMIN_NEW_LEAD: IconUserQuestion,
};

export const notificationMessages = {
  ADMIN_NEW_ORDER: 'admin-new-order',
  ADMIN_NEW_SELLER: 'admin-new-seller',
  ADMIN_NEW_LEAD: 'admin-new-lead',
};

export const localeOptions = {
  EN: 'en',
  FR: 'fr',
};

export const DEFAULT_PASSWORD = 'ECOMNESS2024';

export enum productCategoryOptions {
  FURNITURE = 'FURNITURE',
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
  OTHER = 'OTHER',
}

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
  LIGHT_BLUE = 'LIGHT_BLUE',
  NAVY_BLUE = 'NAVY_BLUE',
  TURQUOISE = 'TURQUOISE',
  BEIGE = 'BEIGE',
  BROWN = 'BROWN',
  GRAY = 'GRAY',
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
  [colorOptions.PINK]: '#FFC0CB',
  [colorOptions.LIGHT_BLUE]: '#ADD8E6',
  [colorOptions.NAVY_BLUE]: '#000080',
  [colorOptions.TURQUOISE]: '#40E0D0',
  [colorOptions.BEIGE]: '#F5F5DC',
  [colorOptions.BROWN]: '#A52A2A',
  [colorOptions.GRAY]: '#808080',
};
