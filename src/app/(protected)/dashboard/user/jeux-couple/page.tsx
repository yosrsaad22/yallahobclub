'use client';

import React, { useState } from 'react';

const categories = [
  {
    title: 'حبّك بهناس',
    questions: [
      'Quelle est la chose la plus mignonne que ton/ta partenaire ait faite pour toi ?',
      'Qu’est-ce qui t’a attiré(e) en premier chez ton/ta partenaire ?',
      'Décris un souvenir romantique que vous partagez.',
    ],
  },
  {
    title: 'عرّي حقيقتك',
    questions: [
      'Quelle est ta plus grande peur dans une relation ?',
      'Quelle est une chose que tu n’as jamais dite à ton/ta partenaire ?',
      'Quand t’es-tu senti(e) le plus vulnérable avec ton/ta partenaire ?',
    ],
  },
  {
    title: 'زيدني منّك',
    questions: [
      'Quelle habitude aimerais-tu créer ensemble ?',
      'Un rêve que vous pourriez réaliser à deux ?',
      'Qu’aimerais-tu explorer ensemble prochainement ?',
    ],
  },
];

export default function JeuxCouple() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const flipCard = (cardKey: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Jeux de Communication pour Couples</h1>
      <p className="mt-4 text-gray-700">
        Cliquez sur les cartes pour découvrir des questions et renforcer votre complicité ❤️
      </p>

      {categories.map((category, categoryIndex) => (
        <div key={category.title} className="mt-10">
          <h2 className="text-xl font-semibold text-pink-700 mb-4">{category.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
            {category.questions.map((question, questionIndex) => {
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
                    {/* Front */}
                    <div
                      className="absolute w-full h-full bg-white shadow-lg rounded-xl flex justify-center items-center p-6"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <h3 className="text-lg font-semibold text-center text-gray-800">
                        Clique pour découvrir
                      </h3>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute w-full h-full bg-red-500 text-white shadow-lg rounded-xl flex justify-center items-center p-6 rotateY-180"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <p className="text-md text-center">{question}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
