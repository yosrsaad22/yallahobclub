import { IconHeart, IconCalendarHeart, IconMessageHeart, IconCash, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { IconLayoutDashboard } from '@tabler/icons-react';
import Image from 'next/image';

export default function UserHome() {
  return (
    <div className="flex-1 bg-gray-50 p-6 md:p-8">
      {/* Main Content */}
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
        
        {/* Vie de Couple Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-pink-600 rounded mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800">Vie de Couple</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Image Banner */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden">
              <img
                src="/img/couple.jpg"
                alt="Couple à la plage au coucher du soleil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-6 text-white max-w-2xl">
                  <h3 className="text-xl md:text-2xl font-bold drop-shadow-sm mb-2">Enrichir votre relation</h3>
                  <p className="text-sm md:text-base drop-shadow-sm">
                    Renforcez votre relation grâce à nos activités, jeux et ressources spécialement conçues pour les couples tunisiens.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {/* Card 1 */}
              <Link href="/dashboard/user/jeux-couple" className="block">
                <div className="p-6 hover:bg-red-50 transition-colors cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                      <IconMessageHeart className="w-6 h-6 text-red-600" stroke={1.5} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Jeux de communication</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apprenez à mieux vous connaître et renforcez votre complicité
                    </p>
                    <span className="text-red-600 font-medium text-sm flex items-center mt-auto">
                      Découvrir
                      <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Card 2 */}
              <Link href="/dashboard/user/Activites" className="block">
                <div className="p-6 hover:bg-red-50 transition-colors cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                      <IconCalendarHeart className="w-6 h-6 text-red-600" stroke={1.5} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Activités à deux</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Des idées inspirantes pour raviver votre complicité au quotidien
                    </p>
                    <span className="text-red-600 font-medium text-sm flex items-center mt-auto">
                      Découvrir
                      <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Card 3 */}
              <Link href="/dashboard/user/Article" className="block">
                <div className="p-6 hover:bg-red-50 transition-colors cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                      <IconHeart className="w-6 h-6 text-red-600" stroke={1.5} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Articles et Conseils</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Des ressources pratiques pour construire un couple épanoui
                    </p>
                    <span className="text-red-600 font-medium text-sm flex items-center mt-auto">
                      Découvrir
                      <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Card 4 */}
              <Link href="/dashboard/user/budgetplanner" className="block">
                <div className="p-6 hover:bg-red-50 transition-colors cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                      <IconCash className="w-6 h-6 text-red-600" stroke={1.5} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Planificateur de Budget</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Organisez vos finances de manière transparente et efficace
                    </p>
                    <span className="text-red-600 font-medium text-sm flex items-center mt-auto">
                      Découvrir
                      <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>  
      </div>
    </div>
  );
}