import { Metadata } from 'next';
import ManageJeux from '@/components/dashboard/admin/manage-jeux';

export const metadata: Metadata = {
  title: 'Gestion des Cartes Couples | Dashboard',
  description: 'Interface d\'administration des cartes de jeu',
};

export default function JeuxCartesAdminPage() {
  return <ManageJeux />;
}