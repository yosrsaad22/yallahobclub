'use client';
import React from 'react';

const categories = [
  {
    name: "Amour & Communication",
    articles: [
      {
        title: "10 questions pour renforcer votre lien",
        description: "Des questions profondes pour des conversations enrichissantes avec votre partenaire.",
        image: "/img/communication1.jpg",
      },
      {
        title: "Comment mieux communiquer dans votre couple",
        description: "Des stratégies simples pour améliorer la communication et la compréhension.",
        image: "/img/communication2.jpg",
      },
      {
        title: "Rituels quotidiens pour dire 'Je t’aime'",
        description: "Des habitudes quotidiennes qui montrent l’amour sans mots.",
        image: "/img/communication3.jpg",
      },
    ],
  },
  {
    name: "Plaisir & Activités",
    articles: [
      {
        title: "15 idées de rendez-vous créatifs à la maison",
        description: "Ramenez la magie des rendez-vous dans votre quotidien.",
        image: "/img/fun1.jpg",
      },
      {
        title: "Projets DIY pour les couples",
        description: "Renforcez votre lien en créant ensemble.",
        image: "/img/fun2.jpg",
      },
      {
        title: "Liste d’aventures pour le week-end",
        description: "Pimentez vos week-ends avec ces idées spontanées et amusantes.",
        image: "/img/fun3.jpg",
      },
    ],
  },
  {
    name: "Conseils Relationnels",
    articles: [
      {
        title: "Gérer les conflits avec amour",
        description: "Des moyens sains pour résoudre les désaccords.",
        image: "/img/conflict1.jpg",
      },
      {
        title: "Maintenir la confiance dans votre couple",
        description: "Construisez et gardez la confiance avec votre partenaire.",
        image: "/img/conflict2.jpg",
      },
      {
        title: "Le pouvoir des excuses",
        description: "Pourquoi savoir dire pardon peut renforcer votre relation.",
        image: "/img/conflict3.jpg",
      },
    ],
  },
  {
    name: "Bien-être & Évolution",
    articles: [
      {
        title: "Méditation pour les couples",
        description: "Restez connectés et attentifs ensemble.",
        image: "/img/well1.jpg",
      },
      {
        title: "Fixer des objectifs de couple",
        description: "Évoluez intentionnellement à deux.",
        image: "/img/well2.jpg",
      },
      {
        title: "Équilibrer le temps personnel et à deux",
        description: "Des conseils pour une relation harmonieuse.",
        image: "/img/well3.jpg",
      },
    ],
  },
];

export default function CouplesArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-[#b91c1c]">
          Articles pour les couples ❤️
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Découvrez des conseils utiles, de l’inspiration et des idées pour nourrir votre relation.
        </p>
      </div>

      {categories.map((category, index) => (
        <section key={index}>
          <h2 className="text-2xl font-bold text-[#b91c1c] mb-6">{category.name}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {category.articles.map((article, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition duration-300"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#b91c1c]">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{article.description}</p>
                  <button className="mt-4 text-sm text-white bg-[#f87171] hover:bg-[#dc2626] px-4 py-2 rounded-full transition">
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
