import { NavItem } from '@/types';
import { IconLayoutDashboard, IconUsers, IconSettings, IconHeart } from '@tabler/icons-react';

export enum roleOptions {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

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
    href: '/dashboard/user/vie-de-couple',
    icon: <IconHeart/>,
  },
  {
    title: 'Paramètres',
    href: '/dashboard/admin/settings',
    icon: <IconSettings />,
  },
  
];

export const userNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard/user',
    icon: <IconLayoutDashboard />,
  },
  {
    title: 'Paramètres',
    href: '/dashboard/user/settings',
    icon: <IconSettings />,
  },
];

export const MEDIA_HOSTNAME = 'https://utfs.io/f/';
