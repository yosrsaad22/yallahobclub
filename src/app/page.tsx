import { Navbar } from '@/components/layout/navbar';
import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';


export default function Home() {
  return (
    <div className="relative w-full">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-screen w-full object-cover z-0"
      >
        <source src="/video/ba.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-red-800 bg-opacity-10 z-0"></div>

      {/* Content */}
      <div className="relative z-10 pt-[4.1rem] text-foreground/90">
        <Navbar />
        <main className="text-center">
          {/* Hero Section */}
          <div className="flex h-[calc(100vh-4.1rem)] w-full items-center justify-center">
            <h1 className="text-6xl font-bold text-red-800">Bienvenue à YallaHob.Club</h1>
          </div>

          {/* Qui sommes-nous Section */}
          <section id="qui-sommes-nous" className="py-20 bg-gray-100">
  <div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-12">
    
    {/* Texte à gauche */}
    <div className="lg:w-1/2 text-left">
      <h2 className="text-4xl font-bold text-red-800 mb-6">Qui sommes-nous ?</h2>
      <p className="text-lg mb-6 text-gray-800">
        <strong>YallaHob.Club</strong> est né de <strong>YallaHob</strong>, un jeu de cartes pour couples tunisiens, conçu pour encourager l’écoute, le dialogue et la complicité. 
        Aujourd’hui, la plateforme réunit toute la famille à travers des <strong>jeux</strong>, <strong>activités</strong> et <strong>articles</strong> pensés pour créer des souvenirs inoubliables.
      </p>
      <a
        href="https://yallahob.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow transition"
      >
        Découvrir
      </a>
    </div>

    {/* Image à droite */}
    <div className="lg:w-1/2 flex justify-center">
      <img
        src="/img/img1.jpg" // remplace par le bon chemin si différent
        alt="Qui sommes-nous"
        className="w-full max-w-md rounded-lg shadow-lg"
      />
    </div>
  </div>
</section>
          {/* Nos Produits Section */}
<section id="nos-produits" className="py-20 bg-white">
  <div className="container mx-auto px-6 lg:px-20">
    <h2 className="text-4xl font-bold text-red-800 mb-12 text-center">Nos Produits</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Produit 1 */}
      <div className="flex flex-col items-center text-center p-4 shadow-lg rounded-lg">
        <img
          src="/img/img3.jpeg"
          alt="YallaHob"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-semibold text-red-700 mb-2">YallaHob</h3>
        <a
          href="https://yallahob.com/produit/jeu-de-couple-tunisie/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition"
        >
          En savoir plus
        </a>
      </div>

      {/* Produit 2 */}
      <div className="flex flex-col items-center text-center p-4 shadow-lg rounded-lg">
        <img
          src="/img/chorba-brike.jpeg"
          alt="chorba brike"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-semibold text-red-700 mb-2">chorba brike</h3>
        <a
          href="https://yallahob.com/produit/chorba-brik-lablebi-kafteji-mlewi/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition"
        >
          En savoir plus
        </a>
      </div>

      {/* Produit 3 */}
      <div className="flex flex-col items-center text-center p-4 shadow-lg rounded-lg">
        <img
          src="/img/produit3.jpg"
          alt="Yalla Matchy"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Yalla Matchy</h3>
        <a
          href="/products"
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition"
        >
          En savoir plus
        </a>
      </div>
    </div>
  </div>
</section>


        {/* Contact Section */}
<section id="contact" className="py-16 bg-gray-100">
  <div className="max-w-4xl mx-auto text-center px-4">
    <h2 className="text-3xl font-bold text-red-800 mb-6">Contact</h2>
    <p className="text-gray-700 mb-4">
      Une question, une idée ou juste envie de papoter ? Écris-nous !
    </p>
    <p className="mb-6 text-red-600 font-medium">
      contact@yallahob.club
    </p>

    <div className="flex justify-center gap-6 mb-6">
      <a href="https://www.instagram.com/yalla_hob_/" target="_blank" rel="noopener noreferrer">
      <Instagram className="h-6 w-6 text-red-700 hover:text-red-500 transition" />
      </a>
      <a href="https://www.facebook.com/p/Yalla-Hob-61554785100299/" target="_blank" rel="noopener noreferrer">
      <Facebook className="h-6 w-6 text-red-700 hover:text-red-500 transition" />
      </a>
    </div>

    <a
      href="mailto:contact@yallahob.club"
      className="inline-block mt-2 px-5 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-700 hover:text-white transition"
    >
      Écrire un message
    </a>
  </div>
</section>

        </main>
      </div>
    </div>
  );
}
