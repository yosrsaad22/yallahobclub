'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, Map, Calendar, Users, DollarSign, 
  Heart, Sun, Umbrella, Gift, Star, RefreshCw
} from 'lucide-react';
import Image from 'next/image';

type Activity = {
  id: string;
  title: string;
  description: string;
  location: string;
  ageRange: string ; 
  price: number;
  priceCategory: 'gratuit' | 'abordable' | 'modéré' | 'coûteux';
  mood: 'romantique' | 'détente' | 'aventureux' | 'culturel' | 'gastronomique';
  weather: 'intérieur' | 'extérieur' | 'les_deux';
  imageUrl: string;
  date?: string;
};

type Filters = {
  search: string;
  ageRange: string[];
  location: string;
  priceCategory: string[];
  mood: string[];
  weather: string[];
};

const AGE_RANGES = ['18+']; // Simplifié pour les couples
const PRICE_CATEGORIES = ['gratuit', 'abordable', 'modéré', 'coûteux'];
const MOODS = ['romantique', 'détente', 'aventureux', 'culturel', 'gastronomique'];
const WEATHER_OPTIONS = ['intérieur', 'extérieur', 'les_deux'];
const LOCATIONS = ['Tunis', 'Hammamet', 'Sousse', 'Monastir', 'Djerba', 'Bizerte', 'Carthage', 'Sfax', 'Tabarka', 'Tozeur', 'Sidi Bou Saïd'];

export default function ActivitesCouple() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    ageRange: [],
    location: '',
    priceCategory: [],
    mood: [],
    weather: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let results = activities;

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        activity => 
          activity.title.toLowerCase().includes(searchLower) || 
          activity.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par tranche d'âge (simplifié pour les couples)
    if (filters.ageRange.length > 0) {
      results = results.filter(activity => 
        filters.ageRange.includes(activity.ageRange)
      );
    }

    // Filtre par localisation
    if (filters.location) {
      results = results.filter(activity => 
        activity.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Filtre par catégorie de prix
    if (filters.priceCategory.length > 0) {
      results = results.filter(activity => 
        filters.priceCategory.includes(activity.priceCategory)
      );
    }

    // Filtre par ambiance
    if (filters.mood.length > 0) {
      results = results.filter(activity => 
        filters.mood.includes(activity.mood)
      );
    }

    // Filtre par météo
    if (filters.weather.length > 0) {
      results = results.filter(activity => 
        filters.weather.includes(activity.weather) || 
        filters.weather.includes('les_deux')
      );
    }

    setFilteredActivities(results);
  }, [filters, activities]);

  // Gérer la mise à jour des filtres
  const handleFilterChange = (
    filterType: keyof Filters, 
    value: string | string[]
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Gérer les filtres de type tableau (checkbox)
  const handleArrayFilterToggle = (
    filterType: 'ageRange' | 'priceCategory' | 'mood' | 'weather',
    value: string
  ) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      if (Array.isArray(currentValues)) {
        return {
          ...prev,
          [filterType]: currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value]
        };
      }
      return prev;
    });
  };

  // Gérer l'ajout/retrait des favoris
  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });

    // Sauvegarde dans le localStorage
    const updatedFavorites = favorites.includes(activityId) 
      ? favorites.filter(id => id !== activityId)
      : [...favorites, activityId];
      
    localStorage.setItem('coupleActivitiesFavorites', JSON.stringify(updatedFavorites));
  };

  // Charger les favoris depuis le localStorage au chargement
  useEffect(() => {
    const savedFavorites = localStorage.getItem('coupleActivitiesFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    }
  }, []);

  // Fonction pour filtrer uniquement les favoris
  const showOnlyFavorites = () => {
    if (favorites.length > 0) {
      setFilteredActivities(activities.filter(activity => favorites.includes(activity.id)));
    }
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      search: '',
      ageRange: [],
      location: '',
      priceCategory: [],
      mood: [],
      weather: []
    });
  };

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-2">Activités en Couple en Tunisie</h1>
          <p className="text-gray-600">
            Découvrez des expériences romantiques, des escapades et des moments inoubliables à partager en couple
            partout en Tunisie.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une activité..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <button
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
              <span>Filtres</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              onClick={resetFilters}
            >
              <RefreshCw className="h-5 w-5" />
              <span>Réinitialiser</span>
            </button>
            <button
              className={`flex items-center justify-center gap-2 ${favorites.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} px-4 py-2 rounded-md hover:bg-red-600 transition-colors`}
              onClick={showOnlyFavorites}
              disabled={favorites.length === 0}
            >
              <Heart className="h-5 w-5" fill={favorites.length > 0 ? "currentColor" : "none"} />
              <span>Favoris ({favorites.length})</span>
            </button>
          </div>

          {/* Panneau de filtres dépliable */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 pt-4 border-t border-gray-200">
              {/* Filtre par âge - simplifié pour les couples */}
              <div>
                <h3 className="font-medium text-gray-800">Public</h3>
                <div className="space-y-2">
                  {AGE_RANGES.map((ageRange) => (
                    <label key={ageRange} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.ageRange.includes(ageRange)}
                        onChange={() => handleArrayFilterToggle('ageRange', ageRange)}
                        className="form-checkbox h-5 w-5 text-red-600"
                      />
                      <span className="ml-2 text-sm">Adultes ({ageRange})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtre par catégorie de prix */}
              <div>
                <h3 className="font-medium text-gray-800">Catégorie de prix</h3>
                <div className="space-y-2">
                  {PRICE_CATEGORIES.map((priceCategory) => (
                    <label key={priceCategory} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.priceCategory.includes(priceCategory)}
                        onChange={() => handleArrayFilterToggle('priceCategory', priceCategory)}
                        className="form-checkbox h-5 w-5 text-red-600"
                      />
                      <span className="ml-2 text-sm">{priceCategory}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtre par ambiance */}
              <div>
                <h3 className="font-medium text-gray-800">Ambiance</h3>
                <div className="space-y-2">
                  {MOODS.map((mood) => (
                    <label key={mood} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.mood.includes(mood)}
                        onChange={() => handleArrayFilterToggle('mood', mood)}
                        className="form-checkbox h-5 w-5 text-red-600"
                      />
                      <span className="ml-2 text-sm">{mood}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtre par météo */}
              <div>
                <h3 className="font-medium text-gray-800">Type de météo</h3>
                <div className="space-y-2">
                  {WEATHER_OPTIONS.map((weather) => (
                    <label key={weather} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.weather.includes(weather)}
                        onChange={() => handleArrayFilterToggle('weather', weather)}
                        className="form-checkbox h-5 w-5 text-red-600"
                      />
                      <span className="ml-2 text-sm">{weather}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste des activités filtrées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800">{activity.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <div className="text-xs text-gray-500 mb-2">
                    <span>{activity.location}</span> | <span>{activity.mood}</span> | <span>{activity.priceCategory}</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(activity.id)}
                    className="flex items-center text-sm text-red-500 hover:text-red-600"
                  >
                    <Heart className="w-4 h-4 mr-1" fill={favorites.includes(activity.id) ? "currentColor" : "none"} />
                    {favorites.includes(activity.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              Aucune activité trouvée pour les filtres sélectionnés.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sample mock data for couple activities
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Dîner en bord de mer à Sidi Bou Saïd',
    description: 'Profitez d\'un dîner romantique avec vue sur la mer dans l\'un des plus beaux villages méditerranéens.',
    location: 'Sidi Bou Saïd',
    ageRange: '18+',
    price: 120,
    priceCategory: 'coûteux',
    mood: 'romantique',
    weather: 'extérieur',
    imageUrl: '/img/sidibou.jpg',
  },
  {
    id: '2',
    title: 'Spa et massage en duo',
    description: 'Offrez-vous un moment de détente absolue avec un massage en couple dans l\'un des meilleurs spas de Hammamet.',
    location: 'Hammamet',
    ageRange: '18+',
    price: 200,
    priceCategory: 'coûteux',
    mood: 'détente',
    weather: 'intérieur',
    imageUrl: '/img/spa.jpg',
  },
  {
    id: '3',
    title: 'Balade à cheval sur la plage',
    description: 'Découvrez les plages de Djerba au coucher du soleil lors d\'une balade romantique à cheval.',
    location: 'Djerba',
    ageRange: '18+',
    price: 80,
    priceCategory: 'modéré',
    mood: 'aventureux',
    weather: 'extérieur',
    imageUrl: '/img/cheval.jpg',
  },
  {
    id: '4',
    title: 'Cours de cuisine tunisienne',
    description: 'Apprenez ensemble à préparer les délices de la cuisine tunisienne avec un chef local et dégustez vos créations.',
    location: 'Tunis',
    ageRange: '18+',
    price: 70,
    priceCategory: 'modéré',
    mood: 'gastronomique',
    weather: 'intérieur',
    imageUrl: '/img/cook.jpg',
  },
  {
    id: '5',
    title: 'Visite des ruines de Carthage',
    description: 'Explorez ensemble les vestiges de l\'ancienne cité de Carthage et découvrez son riche patrimoine historique.',
    location: 'Carthage',
    ageRange: '18+',
    price: 15,
    priceCategory: 'abordable',
    mood: 'culturel',
    weather: 'extérieur',
    imageUrl: '/img/carthage.jpg',
  },
  {
    id: '6',
    title: 'Promenade en bateau au coucher du soleil',
    description: 'Une croisière romantique au coucher du soleil le long des côtes tunisiennes avec champagne et amuse-bouches.',
    location: 'Sousse',
    ageRange: '18+',
    price: 100,
    priceCategory: 'modéré',
    mood: 'romantique',
    weather: 'extérieur',
    imageUrl: '/img/bateau.jpg',
  },
];