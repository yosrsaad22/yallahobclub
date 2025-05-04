import { NavItem } from '@/types';
import {
  IconLayoutDashboard,
  IconUsers,
  IconSettings,
  IconHeart,
  IconHome,
  IconCards,
  IconActivity,
  IconFileText,
  IconWallet,
  IconHomeHeart,
  IconSchool,
  IconUsersGroup,
  IconBabyBottle,
  IconMessages,
  IconCalendarHeart,
  IconBook2,
  IconPigMoney,
} from '@tabler/icons-react';

export enum roleOptions {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Couple Section (Sub Nav Items)
const coupleSubItems: NavItem[] = [
  {
    title: 'Jeux de carte',
    href: '/dashboard/user/couple/jeux-couple',
    icon: <IconCards />,
  },
  {
    title: 'Activités',
    href: '/dashboard/user/couple/Activites',
    icon: <IconActivity />,
  },
  {
    title: 'Articles',
    href: '/dashboard/user/couple/Article',
    icon: <IconFileText />,
  },
];

const coupleExtras: NavItem[] = [
  {
    title: 'Budget Planner',
    href: '/dashboard/user/couple/budgetplanner',
    icon: <IconWallet />,
  },
];

// Family Section (Sub Nav Items)
const familySubItems: NavItem[] = [
  {
    title: 'Maison',
    href: '/dashboard/user/family/jeux-famille',
    icon: <IconHomeHeart />,
  },
  {
    title: 'Parentalité',
    href: '/dashboard/user/famille/Activites-famille',
    icon: <IconBabyBottle />,
  },
  {
    title: 'Relations',
    href: '/dashboard/user/vie-de-famille/Article-famille',
    icon: <IconUsersGroup />,
  },
];

// Admin Sidebar
export const adminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard/admin',
    icon: <IconLayoutDashboard />,
  },
  {
    title: 'Utilisateurs',
    href: '/dashboard/admin/users',
    icon: <IconUsers />,
  },
  {
    title: 'Vie de Couple',
    href: '/dashboard/user/couple',
    icon: <IconCalendarHeart />,
  },
  {
    title: 'Vie de Parent',
    href: '/dashboard/user/family',
    icon: <IconHomeHeart />,
  },
  {
    title: 'Paramètres',
    href: '/dashboard/admin/settings',
    icon: <IconSettings />,
  },
];

// User Sidebar – Couple Section
export const userNavItems: NavItem[] = [
  {
    title: 'Jeux de communication',
    href: '/dashboard/user/couple/jeux-couple',
    icon: <IconMessages />,
  },
  {
    title: 'Activités en couple',
    href: '/dashboard/user/couple/Activites',
    icon: <IconCalendarHeart />,
  },
  {
    title: 'Articles',
    href: '/dashboard/user/couple/Article',
    icon: <IconBook2 />,
  },
  {
    title: 'Planifier budgets',
    href: '/dashboard/user/couple/budgetplanner',
    icon: <IconPigMoney />,
  },
  {
    title: 'Paramètres',
    href: '/dashboard/user/settings',
    icon: <IconSettings />,
  },
];

// Navigation composition
export const coupleNavItems: NavItem[] = [
  ...coupleSubItems,
  ...coupleExtras,
];

export const familyNavItems: NavItem[] = [
  ...familySubItems,
];

// Card Styles
export const cardStyles: Record<
  string,
  {
    image: string;
    backImage: string;
    backColor: string;
  }
> = {
  'حبّك بهناس': {
    image: '/img/hobekbahnes.png',
    backImage: '/img/backhobek.PNG',
    backColor: 'bg-gradient-to-br from-purple-900 to-purple-900',
  },
  'عرّي حقيقتك': {
    image: '/img/3ari79i9tek.png',
    backImage: '/img/back3ari.PNG',
    backColor: 'bg-gradient-to-br from-blue-900 to-blue-950',
  },
  'زيدني منّك': {
    image: '/img/zidnimenek.png',
    backImage: '/img/backzidni.PNG',
    backColor: 'bg-gradient-to-br from-red-800 to-red-900',
  },
};

// Media constant
export const MEDIA_HOSTNAME = 'https://utfs.io/f/';
