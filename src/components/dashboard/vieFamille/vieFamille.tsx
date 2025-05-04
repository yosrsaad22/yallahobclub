'use client';

import Link from 'next/link';
import { IconHeart, IconCalendarHeart, IconMessageHeart, IconChevronRight } from '@tabler/icons-react';

export function VieDeFamilleSection() {
  return (
    <section>
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-600 rounded mr-3"></div>
        <h2 className="text-2xl font-bold text-gray-800">Vie de Famille</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Image Banner */}
        <div className="relative overflow-hidden rounded-lg shadow-lg h-64">
  <img 
    src="/img/family.jpg"
    alt="happy family"
    className="w-full h-full object-cover object-bottom transition-transform duration-300 hover:scale-105"
  />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
            <div className="p-6 text-white max-w-2xl">
              <h3 className="text-xl md:text-2xl font-bold drop-shadow-sm mb-2">Moments en famille</h3>
              <p className="text-sm md:text-base drop-shadow-sm">
                Découvrez des ressources pour toute la famille, allant des conseils aux activités à réaliser ensemble.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {/* Card 1 */}
          <Link href="/dashboard/user/family/jeux-famille" className="block">
            <div className="p-6 hover:bg-blue-50 transition-colors cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <IconHeart className="w-6 h-6 text-blue-600" stroke={1.5} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Jeux de communication</h3>
                <h4 className="text-blue-600 text-sm mb-2">#Version_Famille</h4>
                <p className="text-gray-600 mb-4 text-sm">
                  Renforcez les liens familiaux avec nos activités interactives
                </p>
                <span className="text-blue-600 font-medium text-sm flex items-center mt-auto">
                  Découvrir
                  <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/dashboard/user/family/Activites-famille" className="block">
            <div className="p-6 hover:bg-blue-50 transition-colors cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <IconCalendarHeart className="w-6 h-6 text-blue-600" stroke={1.5} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Activités en famille</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Des idées pour créer des souvenirs inoubliables ensemble
                </p>
                <span className="text-blue-600 font-medium text-sm flex items-center mt-auto">
                  Découvrir
                  <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/dashboard/user/family/Article-famille" className="block">
            <div className="p-6 hover:bg-blue-50 transition-colors cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <IconMessageHeart className="w-6 h-6 text-blue-600" stroke={1.5} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Articles familiaux</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Des ressources pratiques et conseils pour toute la famille
                </p>
                <span className="text-blue-600 font-medium text-sm flex items-center mt-auto">
                  Découvrir
                  <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
