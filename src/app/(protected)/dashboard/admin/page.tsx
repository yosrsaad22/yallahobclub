'use client';

import Link from 'next/link';
import {
  IconLayoutDashboard,
  IconCards,
  IconUserHeart,
  IconUsers,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const adminLinks = [
  {
    href: '/dashboard/admin/jeux-cartes',
    bgColor: 'bg-red-100 hover:bg-red-200',
    icon: <IconCards className="h-8 w-8 text-red-600" />,
    title: 'Gérer les Jeux de Cartes',
    description: 'Modifier, ajouter ou supprimer les cartes de couple',
  },
  {
    href: '/dashboard/admin/activites',
    bgColor: 'bg-pink-100 hover:bg-pink-200',
    icon: <IconUserHeart className="h-8 w-8 text-pink-600" />,
    title: 'Gérer les Activités',
    description: 'Ajouter, filtrer ou éditer les idées d’activités',
  },
  {
    href: '/dashboard/admin/utilisateurs',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
    icon: <IconUsers className="h-8 w-8 text-blue-600" />,
    title: 'Gérer les Utilisateurs',
    description: 'Voir ou modifier les rôles et accès des utilisateurs',
  },
];

export default function AdminHome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/unauthorized'); // Crée une page /unauthorized si besoin
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 text-3xl font-bold">
        <IconLayoutDashboard className="h-7 w-7 text-red-600" />
        <h2 className="tracking-tight">Tableau de bord Administrateur</h2>
      </div>

      {/* Admin Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`${link.bgColor} transition rounded-xl p-5 flex items-center space-x-4 shadow-sm`}
          >
            {link.icon}
            <div>
              <h3 className="text-lg font-semibold">{link.title}</h3>
              <p className="text-sm text-gray-600">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
