
import { Metadata } from 'next';
import ManageArticles from '@/components/dashboard/admin/manage-articles';

export const metadata: Metadata = {
  title: 'Gestion des Articles | Dashboard',
  description: 'Interface d\'administration des articles',
};

export default function JeuxCartesAdminPage() {
  return <ManageArticles />;
}