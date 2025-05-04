import React, { useEffect, useState } from 'react';
import { PlusCircle, Save, X, Pencil, Trash2, Loader2, Filter, Calendar, MapPin, DollarSign, Tag, Cloud, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getActivities, createActivity, updateActivity, deleteActivity } from '@/actions/activite';

// Complete Activity type based on user requirements
type Activity = {
  id: string;
  title: string;
  description: string;
  location: string;
  ageRange: string;
  price: number;
  priceCategory: 'gratuit' | 'abordable' | 'modéré' | 'coûteux';
  mood: 'amusant' | 'éducatif' | 'relaxant' | 'aventureux' | 'créatif';
  weather: 'intérieur' | 'extérieur' | 'les_deux';
  imageUrl: string;
  date?: string;
  typeId: string;
};

// Constants for select fields
const PRICE_CATEGORIES = ['gratuit', 'abordable', 'modéré', 'coûteux'] as const;
const MOODS = ['amusant', 'éducatif', 'relaxant', 'aventureux', 'créatif'] as const;
const WEATHER_OPTIONS = ['intérieur', 'extérieur', 'les_deux'] as const;

export default function ManageActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: '',
    description: '',
    location: '',
    ageRange: '',
    price: 0,
    priceCategory: 'gratuit',
    mood: 'amusant',
    weather: 'intérieur',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    typeId: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{
    type: 'mood' | 'weather' | 'priceCategory' | 'all',
    value: string
  }>({ type: 'all', value: 'all' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    const response = await getActivities();
    if (response.success && response.data) {
      setActivities(response.data);
    } else {
      toast.error(response.error || 'Erreur lors du chargement des activités');
    }
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title.trim() || !newActivity.description.trim()) {
      toast.error('Titre et description requis');
      return;
    }

    setIsLoading(true);
    const response = await createActivity(newActivity);
    if (response.success && response.data) {
      toast.success('Activité ajoutée');
      setActivities(prev => [...prev, response.data]);
      setNewActivity({
        title: '',
        description: '',
        location: '',
        ageRange: '',
        price: 0,
        priceCategory: 'gratuit',
        mood: 'amusant',
        weather: 'intérieur',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0],
        typeId: ''
      });
      setShowAddForm(false);
    } else {
      toast.error(response.error || 'Erreur ajout activité');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Supprimer cette activité ?')) return;
    setIsLoading(true);
    const response = await deleteActivity(id);
    if (response.success) {
      toast.success('Activité supprimée');
      setActivities(prev => prev.filter(a => a.id !== id));
    } else {
      toast.error(response.error || 'Erreur suppression');
    }
    setIsLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!editingActivity) return;
    setIsLoading(true);
    const response = await updateActivity(editingActivity.id, editingActivity);
    if (response.success) {
      toast.success('Activité mise à jour');
      setActivities(prev =>
        prev.map(a => (a.id === editingActivity.id ? editingActivity : a))
      );
      setEditingActivity(null);
    } else {
      toast.error(response.error || 'Erreur mise à jour');
    }
    setIsLoading(false);
  };

  const filteredActivities = activities.filter(a => {
    // Apply filter based on active filter
    let matchesFilter = true;
    if (activeFilter.type !== 'all') {
      matchesFilter = a[activeFilter.type] === activeFilter.value;
    }

    // Apply search term
    const searchFields = [
      a.title.toLowerCase(),
      a.description.toLowerCase(),
      a.location.toLowerCase(),
      a.ageRange.toLowerCase()
    ];
    const matchesSearch = searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Group activities by the selected filter criteria
  const getGroupedActivities = () => {
    if (activeFilter.type === 'all') {
      // Group by mood by default when showing all
      return MOODS.map(mood => ({
        groupName: mood,
        activities: filteredActivities.filter(a => a.mood === mood)
      }));
    } else if (activeFilter.type === 'mood') {
      return [{
        groupName: activeFilter.value,
        activities: filteredActivities
      }];
    } else if (activeFilter.type === 'weather') {
      return [{
        groupName: activeFilter.value === 'intérieur' ? 'Intérieur' : 
                  activeFilter.value === 'extérieur' ? 'Extérieur' : 'Les deux',
        activities: filteredActivities
      }];
    } else if (activeFilter.type === 'priceCategory') {
      return [{
        groupName: activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1),
        activities: filteredActivities
      }];
    }
    
    return [{
      groupName: 'Toutes les activités',
      activities: filteredActivities
    }];
  };

  const groupedActivities = getGroupedActivities();

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Activités</h1>
              <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les activités</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <PlusCircle size={18} className="mr-2" />
              Ajouter une activité
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Rechercher par titre, description, lieu..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filter by Mood */}
              <div>
                <label className="block text-sm font-medium mb-1">Filtre par ambiance</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveFilter({ type: 'all', value: 'all' })}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      activeFilter.type === 'all' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                    }`}
                  >
                    Toutes
                  </button>
                  {MOODS.map(mood => (
                    <button
                      key={mood}
                      onClick={() => setActiveFilter({ type: 'mood', value: mood })}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        activeFilter.type === 'mood' && activeFilter.value === mood 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100'
                      }`}
                    >
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filter by Weather */}
              <div>
                <label className="block text-sm font-medium mb-1">Filtre par lieu</label>
                <div className="flex flex-wrap gap-2">
                  {WEATHER_OPTIONS.map(weather => (
                    <button
                      key={weather}
                      onClick={() => setActiveFilter({ type: 'weather', value: weather })}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        activeFilter.type === 'weather' && activeFilter.value === weather 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100'
                      }`}
                    >
                      {weather.charAt(0).toUpperCase() + weather.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filter by Price Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Filtre par prix</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_CATEGORIES.map(priceCategory => (
                    <button
                      key={priceCategory}
                      onClick={() => setActiveFilter({ type: 'priceCategory', value: priceCategory })}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        activeFilter.type === 'priceCategory' && activeFilter.value === priceCategory 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100'
                      }`}
                    >
                      {priceCategory.charAt(0).toUpperCase() + priceCategory.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form
              onSubmit={handleAdd}
              className="bg-gray-50 border rounded-xl p-4 space-y-4 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium">Titre</label>
                  <input
                    value={newActivity.title}
                    onChange={e => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium">Lieu</label>
                  <input
                    value={newActivity.location}
                    onChange={e => setNewActivity({ ...newActivity, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium">URL de l'image</label>
                  <input
                    value={newActivity.imageUrl}
                    onChange={e => setNewActivity({ ...newActivity, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://..."
                    required
                  />
                </div>
                
                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium">Tranche d'âge</label>
                  <input
                    value={newActivity.ageRange}
                    onChange={e => setNewActivity({ ...newActivity, ageRange: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="ex: 6-12 ans"
                  />
                </div>
                
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium">Prix (TND)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newActivity.price}
                    onChange={e => setNewActivity({ 
                      ...newActivity, 
                      price: parseFloat(e.target.value) 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                {/* Price Category */}
                <div>
                  <label className="block text-sm font-medium">Catégorie de prix</label>
                  <select
                    value={newActivity.priceCategory}
                    onChange={e => setNewActivity({ 
                      ...newActivity, 
                      priceCategory: e.target.value as Activity['priceCategory'] 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {PRICE_CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Mood */}
                <div>
                  <label className="block text-sm font-medium">Ambiance</label>
                  <select
                    value={newActivity.mood}
                    onChange={e => setNewActivity({ 
                      ...newActivity, 
                      mood: e.target.value as Activity['mood'] 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {MOODS.map(mood => (
                      <option key={mood} value={mood}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Weather */}
                <div>
                  <label className="block text-sm font-medium">Lieu</label>
                  <select
                    value={newActivity.weather}
                    onChange={e => setNewActivity({ 
                      ...newActivity, 
                      weather: e.target.value as Activity['weather'] 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {WEATHER_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium">Date (optionnelle)</label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={e => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={newActivity.description}
                  onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-600 px-4 py-2 rounded-lg border"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    'Ajouter'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Activities List */}
          {isLoading && !showAddForm ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-red-600 w-8 h-8" />
            </div>
          ) : (
            groupedActivities.map(({ groupName, activities }) => (
              <div key={groupName} className="mb-8">
                <h2 className="text-lg font-semibold mb-3 capitalize">{groupName}</h2>
                
                {activities.length === 0 ? (
                  <p className="text-gray-500 italic">Aucune activité dans cette catégorie</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map(activity => (
                      <div
                        key={activity.id}
                        className="bg-white border rounded-lg shadow-sm overflow-hidden"
                      >
                        {/* Activity Card or Edit Form */}
                        {editingActivity?.id === activity.id ? (
                          // Edit Form
                          <div className="p-4 space-y-3">
                            <h3 className="font-bold text-lg">Modifier l'activité</h3>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Titre</label>
                              <input
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                value={editingActivity.title}
                                onChange={e => setEditingActivity({
                                  ...editingActivity,
                                  title: e.target.value,
                                })}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Description</label>
                              <textarea
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                value={editingActivity.description}
                                onChange={e => setEditingActivity({
                                  ...editingActivity,
                                  description: e.target.value,
                                })}
                                rows={3}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Lieu</label>
                                <input
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.location}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    location: e.target.value,
                                  })}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Âge</label>
                                <input
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.ageRange}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    ageRange: e.target.value,
                                  })}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Prix</label>
                                <input
                                  type="number"
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.price}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    price: parseFloat(e.target.value),
                                  })}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Catégorie de prix</label>
                                <select
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.priceCategory}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    priceCategory: e.target.value as Activity['priceCategory'],
                                  })}
                                >
                                  {PRICE_CATEGORIES.map(pc => (
                                    <option key={pc} value={pc}>{pc}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Ambiance</label>
                                <select
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.mood}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    mood: e.target.value as Activity['mood'],
                                  })}
                                >
                                  {MOODS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Lieu</label>
                                <select
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.weather}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    weather: e.target.value as Activity['weather'],
                                  })}
                                >
                                  {WEATHER_OPTIONS.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Date</label>
                                <input
                                  type="date"
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.date || ''}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    date: e.target.value,
                                  })}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Image URL</label>
                                <input
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editingActivity.imageUrl}
                                  onChange={e => setEditingActivity({
                                    ...editingActivity,
                                    imageUrl: e.target.value,
                                  })}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => setEditingActivity(null)}
                                type="button"
                                className="px-3 py-1.5 border rounded text-sm"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                type="button"
                                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm flex items-center"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 size={14} className="animate-spin mr-1" />
                                ) : (
                                  <Save size={14} className="mr-1" />
                                )}
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Activity Card
                          <>
                            {/* Image */}
                            <div className="relative h-40 bg-gray-100">
                              {activity.imageUrl ? (
                                <img 
                                  src={activity.imageUrl} 
                                  alt={activity.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  Aucune image
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                                <div className="flex gap-2">
                                  <button onClick={() => setEditingActivity(activity)}>
                                    <Pencil size={16} className="text-gray-500 hover:text-gray-700" />
                                  </button>
                                  <button onClick={() => handleDelete(activity.id)}>
                                    <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                                  </button>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                              
                              {/* Tags and Metadata */}
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center text-xs text-gray-500">
                                  <MapPin size={14} className="mr-1" />
                                  <span>{activity.location}</span>
                                </div>
                                
                                {activity.date && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Calendar size={14} className="mr-1" />
                                    <span>{new Date(activity.date).toLocaleDateString('fr-FR')}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center text-xs text-gray-500">
                                  <Users size={14} className="mr-1" />
                                  <span>{activity.ageRange}</span>
                                </div>
                                
                                <div className="flex items-center text-xs text-gray-500">
                                  <DollarSign size={14} className="mr-1" />
                                  <span>{formatPrice(activity.price)} ({activity.priceCategory})</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    <Tag size={12} className="mr-1" />
                                    {activity.mood}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <Cloud size={12} className="mr-1" />
                                    {activity.weather}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}