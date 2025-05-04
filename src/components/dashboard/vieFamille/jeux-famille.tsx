'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Adding age suitability types
type AgeSuitability = 'all' | 'kids' | 'teens' | 'parents';

interface CardProps {
  question: string;
  frontLabel: string;
  icon: string;
  styleType: 'icebreaker' | 'reflection' | 'challenge' | 'family' | 'creativity';
  ageSuitability?: AgeSuitability;
}

const cardStyles = {
  icebreaker: {
    bg: 'bg-gradient-to-r from-pink-200 to-yellow-200',
    text: 'text-pink-800',
    flip: 'rotate-y-180',
  },
  reflection: {
    bg: 'bg-gradient-to-r from-blue-100 to-indigo-200',
    text: 'text-blue-800',
    flip: 'rotate-x-180',
  },
  challenge: {
    bg: 'bg-gradient-to-r from-yellow-100 to-red-100',
    text: 'text-red-700',
    flip: 'rotate-y-180 scale-105',
    border: 'border-4 border-red-300',
  },
  family: {
    bg: 'bg-gradient-to-r from-green-100 to-teal-200',
    text: 'text-green-800',
    flip: 'rotate-y-180',
    border: 'border-4 border-green-300',
  },
  creativity: {
    bg: 'bg-gradient-to-r from-purple-100 to-pink-200',
    text: 'text-purple-800',
    flip: 'rotate-y-180 scale-105',
    border: 'border-4 border-purple-300',
  },
};

const ageBadgeStyles = {
  all: 'bg-green-100 text-green-800 border-green-300',
  kids: 'bg-blue-100 text-blue-800 border-blue-300',
  teens: 'bg-purple-100 text-purple-800 border-purple-300',
  parents: 'bg-amber-100 text-amber-800 border-amber-300',
};

const ageLabels = {
  all: 'Pour tous',
  kids: '4-10 ans',
  teens: '11+ ans',
  parents: 'Parents',
};

function FlippableCard({ question, frontLabel, icon, styleType, ageSuitability = 'all' }: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const [animate, setAnimate] = useState(false);
  const styles = cardStyles[styleType];

  const handleClick = () => {
    setFlipped(!flipped);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 700);
  };

  return (
    <div
      onClick={handleClick}
      className="w-64 h-44 md:w-72 md:h-48 perspective cursor-pointer group"
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d shadow-lg rounded-xl',
          flipped ? styles.flip : '',
          animate ? 'animate-pulse' : '',
        )}
      >
        {/* Age indicator badge */}
        <div className={cn(
          'absolute -top-2 -right-2 z-10 px-2 py-1 text-xs font-bold rounded-full border-2',
          ageBadgeStyles[ageSuitability]
        )}>
          {ageLabels[ageSuitability]}
        </div>

        {/* Front of card */}
        <div className={cn(
          'absolute w-full h-full backface-hidden rounded-xl shadow-md flex flex-col items-center justify-center p-4',
          styles.bg, styles.text,
          'group-hover:shadow-xl transition-shadow duration-300'
        )}>
          <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
          <p className="font-bold text-center text-lg">{frontLabel}</p>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute w-full h-full backface-hidden rounded-xl shadow-md flex items-center justify-center p-6 bg-white text-center',
            styles.bg && styles.bg.replace('bg-gradient-to-r from-', 'bg-').split(' ')[0] + '/10',
            'rotate-y-180'
          )}
        >
          <p className="text-gray-800 font-semibold">{question}</p>
        </div>
      </div>
    </div>
  );
}
type CategoryHeaderProps = {
  title: string;
  emoji: string;
  color: string;
};
function CategoryHeader({ title, emoji, color }: CategoryHeaderProps) {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className={`text-3xl ${color}`}>{emoji}</div>
      <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
    </div>
  );
}

export default function JeuxCommunicationPage() {
  const [filterAge, setFilterAge] = useState<AgeSuitability | 'all'>('all');
  
  // Card filter function
  const shouldShowCard = (ageSuitability: AgeSuitability) => {
    if (filterAge === 'all') return true;
    return ageSuitability === filterAge || ageSuitability === 'all';
  };

  return (
    <main className="py-8 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">Jeux de Communication Familiale</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Des jeux amusants pour améliorer la communication et renforcer les liens en famille. Cliquez sur les cartes pour découvrir des questions et des défis!</p>
      </div>

      {/* Age Filter Bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button 
          onClick={() => setFilterAge('all')}
          className={cn(
            "px-4 py-2 rounded-full font-medium text-sm transition-colors",
            filterAge === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
          )}
        >
          Tous les âges
        </button>
        <button 
          onClick={() => setFilterAge('kids')}
          className={cn(
            "px-4 py-2 rounded-full font-medium text-sm transition-colors",
            filterAge === 'kids' ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
          )}
        >
          Enfants (4-10 ans)
        </button>
        <button 
          onClick={() => setFilterAge('teens')}
          className={cn(
            "px-4 py-2 rounded-full font-medium text-sm transition-colors",
            filterAge === 'teens' ? 'bg-purple-600 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
          )}
        >
          Ados (11+ ans)
        </button>
        <button 
          onClick={() => setFilterAge('parents')}
          className={cn(
            "px-4 py-2 rounded-full font-medium text-sm transition-colors",
            filterAge === 'parents' ? 'bg-amber-600 text-white' : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
          )}
        >
          Parents
        </button>
      </div>

      <div className="space-y-16">
        {/* Section 1: Brise-Glace */}
        <section>
          <CategoryHeader 
            title="Brise-Glace" 
            emoji="🎈" 
            color="text-pink-700" 
          />
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
          {shouldShowCard('all') && (
  <FlippableCard
    styleType="icebreaker"
    frontLabel="Un Objet, Une Histoire"
    icon="🧳"
    question="Quel objet te représente le mieux et pourquoi ?"
    ageSuitability="all"
  />
)}

{shouldShowCard('kids') && (
  <FlippableCard
    styleType="icebreaker"
    frontLabel="Animal Magique"
    icon="🦄"
    question="Si tu pouvais créer un animal magique, à quoi ressemblerait-il ?"
    ageSuitability="kids"
  />
)}

{shouldShowCard('teens') && (
  <FlippableCard
    styleType="icebreaker"
    frontLabel="Une Journée Parfaite"
    icon="🌟"
    question="Décris ta journée idéale du matin au soir."
    ageSuitability="teens"
  />
)}

{shouldShowCard('all') && (
  <FlippableCard
    styleType="icebreaker"
    frontLabel="Musique !"
    icon="🎵"
    question="Quelle chanson te met toujours de bonne humeur ?"
    ageSuitability="all"
  />
)}

{shouldShowCard('kids') && (
  <FlippableCard
    styleType="icebreaker"
    frontLabel="Dessine Avec des Mots"
    icon="🖍️"
    question="Décris ton dessin préféré sans le montrer. Les autres doivent deviner !"
    ageSuitability="kids"
  />
)}

{shouldShowCard('teens') && (
  <FlippableCard
    styleType="icebreaker"
    frontLabel="Changer le Monde"
    icon="🌍"
    question="Si tu pouvais changer une chose dans le monde, ce serait quoi ?"
    ageSuitability="teens"
  />
)}
          </div>
        </section>


        {/* Section 3: Défis Rigolos */}
        <section>
          <CategoryHeader 
            title="Défis Rigolos" 
            emoji="🎉" 
            color="text-red-600" 
          />
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {shouldShowCard('all') && (
              <FlippableCard
                styleType="challenge"
                frontLabel="Défi Danse"
                icon="💃"
                question="Fais une danse rigolote pendant 10 secondes et les autres doivent t'imiter !"
                ageSuitability="all"
              />
            )}
            {shouldShowCard('all') && (
              <FlippableCard
                styleType="challenge"
                frontLabel="Chante Miaou"
                icon="🐱"
                question="Chante une chanson en miaulant comme un chat pendant que les autres doivent deviner la chanson !"
                ageSuitability="all"
              />
            )}
            {shouldShowCard('kids') && (
              <FlippableCard
                styleType="challenge"
                frontLabel="Mime Fou"
                icon="🤪"
                question="Mime un animal de la ferme sans faire de bruit, les autres doivent deviner !"
                ageSuitability="kids"
              />
            )}
            {shouldShowCard('all') && (
              <FlippableCard
                styleType="challenge"
                frontLabel="Grimaces"
                icon="🤡"
                question="Fais la grimace la plus drôle possible et tiens 10 secondes sans rire !"
                ageSuitability="all"
              />
            )}
          </div>
        </section>

        {/* New Section 4: Activités Familiales */}
        <section>
          <CategoryHeader 
            title="Activités Familiales" 
            emoji="👪" 
            color="text-green-700" 
          />
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {shouldShowCard('all') && (
              <FlippableCard
                styleType="family"
                frontLabel="Histoire Collective"
                icon="📚"
                question="Commencez une histoire avec une phrase et chacun ajoute une phrase à tour de rôle !"
                ageSuitability="all"
              />
            )}
            {shouldShowCard('parents') && (
              <FlippableCard
                styleType="family"
                frontLabel="Souvenir Partagé"
                icon="📸"
                question="Partagez un souvenir d'enfance qui a influencé la personne que vous êtes aujourd'hui."
                ageSuitability="parents"
              />
            )}
            {shouldShowCard('kids') && (
              <FlippableCard
                styleType="family"
                frontLabel="Journée Idéale"
                icon="☀️"
                question="Décris comment serait ta journée parfaite en famille. Que feriez-vous ensemble ?"
                ageSuitability="kids"
              />
            )}
            {shouldShowCard('all') && (
              <FlippableCard
                styleType="family"
                frontLabel="Compliments"
                icon="🌈"
                question="Faites un tour et dites une chose que vous admirez chez chaque membre de la famille."
                ageSuitability="all"
              />
            )}
          </div>
        </section>

        {/* New Section 5: Créativité */}
        <section>
          <CategoryHeader 
            title="Créativité" 
            emoji="🎨" 
            color="text-purple-700" 
          />
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {shouldShowCard('kids') && (
              <FlippableCard
                styleType="creativity"
                frontLabel="Dessin Collectif"
                icon="✏️"
                question="Dessinez ensemble ! Une personne commence, puis passe le dessin au suivant qui y ajoute quelque chose."
                ageSuitability="kids"
              />
            )}
            {shouldShowCard('teens') && (
              <FlippableCard
                styleType="creativity"
                frontLabel="Invention"
                icon="💡"
                question="Inventez ensemble un objet qui résoudrait un problème quotidien de votre famille."
                ageSuitability="teens"
              />
            )}
            {shouldShowCard('all') && (
              <FlippableCard
                styleType="creativity"
                frontLabel="Chanson Familiale"
                icon="🎵"
                question="Créez ensemble un petit refrain qui représente votre famille (sur un air connu)."
                ageSuitability="all"
              />
            )}
            {shouldShowCard('parents') && (
              <FlippableCard
                styleType="creativity"
                frontLabel="Histoire de Nom"
                icon="👶"
                question="Racontez l'histoire derrière le choix du prénom de votre enfant."
                ageSuitability="parents"
              />
            )}
            {shouldShowCard('all') && (
  <FlippableCard
    styleType="creativity"
    frontLabel="Publicité Maison"
    icon="📺"
    question="Créez ensemble une publicité drôle pour un objet qui se trouve dans la pièce !"
    ageSuitability="all"
  />
)}

{shouldShowCard('teens') && (
  <FlippableCard
    styleType="creativity"
    frontLabel="Mini Pièce"
    icon="🎭"
    question="Écrivez et jouez une mini scène de théâtre en famille (2 minutes max) !"
    ageSuitability="teens"
  />
)}

{shouldShowCard('kids') && (
  <FlippableCard
    styleType="creativity"
    frontLabel="Créature Magique"
    icon="🦄"
    question="Invente une créature magique avec un nom, des pouvoirs, et un dessin si tu veux !"
    ageSuitability="kids"
  />
)}
          </div>
        </section>
      </div>
      
      {/* Instructions */}
      <div className="mt-16 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Comment jouer ?</h3>
        <div className="space-y-3">
          <p className="text-gray-600">1. Filtrez les cartes par tranche d'âge si vous le souhaitez.</p>
          <p className="text-gray-600">2. Cliquez sur une carte pour découvrir la question ou le défi.</p>
          <p className="text-gray-600">3. Prenez le temps de répondre ou de réaliser le défi en famille.</p>
          <p className="text-gray-600">4. Continuez avec d'autres cartes selon votre envie!</p>
        </div>
      </div>
    </main>
  );
}