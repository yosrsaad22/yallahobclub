// src/components/dashboard/vieFamille/articles-famille.tsx
'use client';
import React from 'react';

const familyCategories = [
  {
    name: "Communication Familiale",
    articles: [
      {
        title: "Comment résoudre les conflits parent-enfant",
        description: "Des approches bienveillantes pour mieux comprendre et gérer les désaccords familiaux.",
        image: "/img/family1.jpg",
      },
      {
        title: "Créer un espace de parole en famille",
        description: "Des idées pour instaurer une communication ouverte et sans jugement.",
        image: "/img/family2.jpg",
      },
      {
        title: "Techniques pour apaiser les tensions à la maison",
        description: "Des astuces pratiques pour retrouver le calme dans les moments difficiles.",
        image: "/img/family3.jpg",
      },
    ],
  },
  {
    name: "Activités pour Renforcer les Liens",
    articles: [
      {
        title: "Jeux pour apprendre à mieux se comprendre",
        description: "Des activités ludiques pour renforcer la complicité entre parents et enfants.",
        image: "/img/family4.jpg",
      },
      {
        title: "Créer des rituels familiaux",
        description: "Renforcez votre unité familiale grâce à des habitudes positives.",
        image: "/img/family5.jpg",
      },
      {
        title: "Projets créatifs à faire ensemble",
        description: "Partagez un moment joyeux en fabriquant quelque chose ensemble.",
        image: "/img/family6.jpg",
      },
    ],
  },
];

export default function ArticlesFamille() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-[#047857]">Articles pour la famille 👨‍👩‍👧‍👦</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Des conseils et idées pour renforcer les relations parents-enfants avec amour et bienveillance.
        </p>
      </div>

      {familyCategories.map((category, index) => (
        <section key={index}>
          <h2 className="text-2xl font-bold text-[#047857] mb-6">{category.name}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {category.articles.map((article, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#047857]">{article.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{article.description}</p>
                  <button className="mt-4 text-sm text-white bg-[#34d399] hover:bg-[#059669] px-4 py-2 rounded-full transition">
                    Lire l'article
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
