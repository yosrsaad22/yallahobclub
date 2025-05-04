import { Metadata } from 'next';
import ActivitesFamille from '@/components/dashboard/vieFamille/activites-famille';

export const metadata: Metadata = {
  title: 'Activités en Famille | Vie Familiale',
  description: 'Découvrez des activités amusantes et enrichissantes à faire avec vos enfants partout en Tunisie',
};

export default function ActivitesFamillePage() {
  return (
    <div className="w-full">
      <ActivitesFamille />
    </div>
  );
}