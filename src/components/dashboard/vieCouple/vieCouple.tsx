'use client';
import { IconHeart, IconCalendarHeart, IconMessageHeart, IconCash, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';

export default function VieCouple() {
  return (
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
          {[
            {
              href: "src/app/(protected)/dashboard/user/couple/jeux-couple",
              icon: <IconMessageHeart className="w-6 h-6 text-red-600" stroke={1.5} />,
              title: "Jeux de communication",
              text: "Apprenez à mieux vous connaitre et renforcez votre complicité",
            },
            {
              href: "src/app/(protected)/dashboard/user/couple/Activites",
              icon: <IconCalendarHeart className="w-6 h-6 text-red-600" stroke={1.5} />,
              title: "Activités à deux",
              text: "Des idées inspirantes pour raviver votre complicité au quotidien",
            },
            {
              href: "src/app/(protected)/dashboard/user/couple/Article",
              icon: <IconHeart className="w-6 h-6 text-red-600" stroke={1.5} />,
              title: "Articles et Conseils",
              text: "Des ressources pratiques pour construire un couple épanoui",
            },
            {
              href: "src/app/(protected)/dashboard/user/couple/budgetplanner",
              icon: <IconCash className="w-6 h-6 text-red-600" stroke={1.5} />,
              title: "Planificateur de Budget",
              text: "Organisez vos finances de manière transparente et efficace",
            },
          ].map(({ href, icon, title, text }) => (
            <Link href={href} key={title} className="block">
              <div className="p-6 hover:bg-red-50 transition-colors cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-100 p-3 rounded-full mb-4">{icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{text}</p>
                  <span className="text-red-600 font-medium text-sm flex items-center mt-auto">
                    Découvrir <IconChevronRight className="w-4 h-4 ml-1" stroke={2} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
