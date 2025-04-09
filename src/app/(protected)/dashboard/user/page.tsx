'use client';

import { IconHeart, IconCalendarHeart, IconMessageHeart, IconCash } from '@tabler/icons-react';
import Link from 'next/link';
import { IconLayoutDashboard } from '@tabler/icons-react';

export default function UserHome() {
  return (
    <div className="flex-1 space-y-6 p-4 pt-6 lg:p-6">
      {/* Header Dashboard */}
      <div className="flex items-center space-x-2 text-3xl font-bold text-gray-800">
        <h2 className="tracking-tight text-red-600"> Vie de Couple </h2>
      </div>

      {/* Vie de Couple Section */}
      <div className="bg-pink-50 rounded-xl p-6 shadow-md">
        <p className="text-gray-700 mb-6">
          Renforcez votre relation grâce à nos activités, jeux et ressources spécialement conçues pour les couples tunisiens.
        </p>

        {/* Cartes en ligne */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte 1 - Jeux de communication */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition">
            <IconMessageHeart className="mx-auto text-red-500 w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg mb-1">Jeux de communication</h4>
            <p className="text-sm text-gray-600 mb-3">
              Apprenez à mieux vous connaître.
            </p>
            <Link href="/dashboard/user/jeux-couple" className="text-red-600 text-sm hover:underline">
              En savoir plus
            </Link>
          </div>

          {/* Carte 2 - Activités à deux */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition">
            <IconCalendarHeart className="mx-auto text-red-500 w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg mb-1">Activités à deux</h4>
            <p className="text-sm text-gray-600 mb-3">
              Des idées pour raviver votre complicité.
            </p>
            <Link href="/dashboard/user/Activites" className="text-red-600 text-sm hover:underline">
              En savoir plus
            </Link>
          </div>

          {/* Carte 3 - Articles et Conseils */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition">
            <IconHeart className="mx-auto text-red-500 w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg mb-1">Articles et Conseils</h4>
            <p className="text-sm text-gray-600 mb-3">
              Des ressources pour un couple épanoui.
            </p>
            <Link href="/articles-couple" className="text-red-600 text-sm hover:underline">
              En savoir plus
            </Link>
          </div>

          {/* Carte 4 - Budget Planner */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition">
            <IconCash className="mx-auto text-red-500 w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg mb-1">Planificateur de Budget</h4>
            <p className="text-sm text-gray-600 mb-3">
              Organisez vos finances de manière transparente et efficace.
            </p>
            <Link href="/budget-couple" className="text-red-600 text-sm hover:underline">
              En savoir plus
            </Link>
          </div>
        </div>
      </div>

      {/* Vie de Famille Section */}
       {/* Header Dashboard */}
       <div className="flex items-center space-x-2 text-3xl font-bold text-gray-800">
        <h2 className="tracking-tight text-blue-600"> Vie de famille </h2>
      </div>
      <div className="bg-blue-50 rounded-xl p-6 shadow-md">
        <p className="text-gray-700 mb-6">
          Découvrez des ressources pour toute la famille, allant des conseils aux activités à réaliser en famille.
        </p>

        {/* Cartes en ligne pour Vie de Famille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition">
            <IconHeart className="mx-auto text-blue-500 w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg mb-1">jeux de communication</h4>
            <h5 className="font-semibold text-lg mb-1">#Version_Famille</h5>
            <p className="text-sm text-gray-600 mb-3">
            Renforcez les liens familiaux .</p>
            <Link href="/conseils-famille" className="text-blue-600 text-sm hover:underline">
              En savoir plus
            </Link>
          </div>
          {/* Carte 1 - Activités en famille */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition">
            <IconCalendarHeart className="mx-auto text-blue-500 w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg mb-1">Activités en famille</h4>
            <p className="text-sm text-gray-600 mb-3">
              Des idées pour créez des souvenirs inoubliables .
            </p>
            <Link href="/activites-famille" className="text-blue-600 text-sm hover:underline">
              En savoir plus
            </Link>
          </div>

          {/* Carte 2 - Conseils familiaux */}
          

          {/* Carte 3 - Articles familiaux */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition">
            <IconMessageHeart className="mx-auto text-blue-500 w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg mb-1">Articles familiaux</h4>
            <p className="text-sm text-gray-600 mb-3">
              Des ressources pour toute la famille.
            </p>
            <Link href="/articles-famille" className="text-blue-600 text-sm hover:underline">
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
