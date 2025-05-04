import React from 'react';
import dynamic from 'next/dynamic';

const ActivitesCouple = dynamic(
  () => import('@/components/dashboard/vieCouple/activites-couple'),
  { ssr: false }
);

export const metadata = {
  title: 'Activités en Couple',
  description: 'Découvrez des idées d\'activités à faire en couple',
};

export default function ActivitesPage() {
  return (
    <main>
      <ActivitesCouple />
    </main>
  );
}