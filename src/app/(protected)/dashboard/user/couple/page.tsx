'use client';
import VieCouple from '@/components/dashboard/vieCouple/vieCouple';
import { IconLayoutDashboard } from '@tabler/icons-react';

export default function UserHome() {
  return (
    <div className="flex-1 bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Bienvenue sur <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-600">Notre Plateforme</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Des ressources et activités pour enrichir votre vie de couple 
          </p>
        </div>

        {/* Vie de Couple Section (imported) */}
        <VieCouple />
      </div>
    </div>
  );
}
