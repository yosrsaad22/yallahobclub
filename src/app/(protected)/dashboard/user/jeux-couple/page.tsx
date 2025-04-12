'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// You can replace this with your data fetching function (API or Firebase)
const fetchCategories = async () => {
  // Example API call or Firestore fetch
  return [
    {
    title: 'حبّك بهناس',
    image: '/img/hobekbahnes.png',
    backImage: '/img/backhobek.PNG',
    backColor: 'bg-gradient-to-br from-purple-900 to-purple-900',
    questions: [
      'شنوا تتفكر من أول مرة خرجنا فيها مع بعضنا ؟ ',
      'حسب رايك شنيا أحسن هدية جاتني من عندك ؟',
      'شنية الحاجة لنعملها كي نحب نكون رومانسي و ما تنجحش',
      'اذا نقوم صباح وانا فاقد(ة) الذاكرة. شنيا اول حاجة تحكيهالي علينا ؟',
    ],
  },
  {
    title: 'عرّي حقيقتك',
    image: '/img/3ari79i9tek.png',
    backImage: '/img/back3ari.PNG',
    backColor: 'bg-gradient-to-br from-blue-900 to-blue-950',
    questions: [
      'شنوا أكثر تجارب مستك في حياتك، بالباهي ولا بالخايب ؟ وهل تتصور عندهم تأثير على علاقتنا ؟ ',
      'ثلاثة حاجات من المستحسن معادش نعملهم خاطر قاعدين يضروا فينا ',
      'شنوا اكثر geste  عملتو مع داركم و فرحك',
      'شنيا اكبر درس تعلمتو من علاقتنا حتى لتوا ؟',
    ],
  },
  {
    title: 'زيدني منّك',
    image: '/img/zidnimenek.png',
    backImage: '/img/backzidni.PNG',
    backColor: 'bg-gradient-to-br from-red-800 to-red-900',
    questions: [
      'فمّا موقف صار خلّاك تقول انا محظوظ(ة) لي انا مع الشخص هذا ؟ ',
      'وريني اكثر تصويرة متاعنا تعز عليك و قلي علاش ؟',
      'شنيا الحاجة لي تتصور تفرحني كان توفرهالي اكثر؟ ',
      'شنيا الحاجة لي شاهي(ة) تعملها توا 🤭 ؟',
    ],
  },
    // Add other categories here...
  ];
};

export default function JeuxCouple() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]); // Dynamic categories

  // Fetch categories dynamically on mount
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    
    loadCategories();
    
    // Optionally listen for updates (e.g., Firestore or WebSocket)
    // This can be added based on your backend solution
  }, []);

  const flipCard = (cardKey: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600 font-din">Jeux de Communication pour Couples</h1>
      <p className="mt-4 text-gray-700">
        Cliquez sur les cartes pour découvrir des questions et renforcer votre complicité ❤️
      </p>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-2 mt-8 mb-6">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(index)}
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              activeCategory === index 
                ? 'bg-red-600 text-white font-medium shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Display only the active category */}
      {categories.map((category, categoryIndex) => (
        <div 
          key={category.title} 
          className={`mt-6 ${activeCategory === categoryIndex ? 'block' : 'hidden'}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
            {category.questions.map((question: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, questionIndex: any) => {
              const cardKey = `${categoryIndex}-${questionIndex}`;
              const isFlipped = flippedCards[cardKey];

              return (
                <div
                  key={cardKey}
                  className="relative w-[250px] h-[350px] perspective-1000 cursor-pointer"
                  onClick={() => flipCard(cardKey)}
                >
                  <div
                    className={`w-full h-full absolute transition-transform duration-500 transform-style-preserve-3d ${
                      isFlipped ? 'rotateY-180' : ''
                    }`}
                  >
                    {/* Front with category-specific image */}
                    <div
                      className="absolute w-full h-full shadow-lg rounded-xl overflow-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <img
                        src={category.image}
                        alt="Carte"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Back with background image and question */}
                    <div
                      className="absolute w-full h-full shadow-lg rounded-xl flex justify-center items-center p-6 rotateY-180"
                      style={{
                        backfaceVisibility: 'hidden',
                        backgroundImage: `url(${category.backImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                      }}
                    >
                      <p className="text-md text-center font-din">{question}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Fun fact section */}
      <div className="mt-16 bg-gradient-to-r from-white via-red-50 to-white p-8 rounded-lg border border-red-200 shadow-sm">
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
            href="http://localhost:3000/dashboard/user/article" 
            className="text-red-600 hover:text-red-700 text-sm flex items-center transition-colors duration-300"
          >
            Plus d'astuces 
            <ChevronDown className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
      <footer className="relative z-10 py-8 px-6 border-t border-red-900/30 mt-12">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Yallahob.Club . Tous droits réservés.</p>
          <p className="mt-2">Créé avec ❤️ pour renforcer votre relation</p>
        </div>
      </footer>

      {/* CSS for the card flip */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .rotateY-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
