import { getCards } from "@/actions/cards";
import { notFound } from "next/navigation";
import { FlippableCard } from "@/components/cards/FlippableCard";
import { cardStyles } from '@/lib/constants';
import { ChevronDown } from "lucide-react";

export default async function JeuxCartesPage() {
  const res = await getCards();
  if (res.error) return notFound();

  const cards = res.data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jeux de Cartes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card: any) => {
          const style = cardStyles[card.category];
          if (!style) return null;

          return (
            <FlippableCard
              key={card.id}
              question={card.question}
              image={style.image}
              backImage={style.backImage}
              backColor={style.backColor}
            />
          );
        })}
      </div>

      {/* Aside Section */}
      <aside className="mt-16 bg-gradient-to-r from-white via-red-50 to-white p-8 rounded-lg border border-red-200 shadow-sm">
        <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Le saviez-vous?
        </h3>
        <p className="text-gray-700">
          Les couples qui pratiquent régulièrement des jeux de communication comme celui-ci 
          rapportent un niveau de satisfaction relationnelle plus élevé de 37% par rapport 
          aux autres. Prenez le temps de vous redécouvrir!
        </p>
        <div className="mt-4 flex justify-end">
          <a 
            href="http://localhost:3000/dashboard/user/vieCouple/articles-couple" 
            className="text-red-600 hover:text-red-700 text-sm flex items-center transition-colors duration-300"
          >
            Plus d'astuces 
            <ChevronDown className="h-4 w-4 ml-1" />
          </a>
        </div>
      </aside>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Yallahob.club . Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
