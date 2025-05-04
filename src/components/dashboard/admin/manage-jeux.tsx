'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, PlusCircle, Save, X, Loader2, Filter, Users, Heart } from 'lucide-react';
import { addCard, deleteCard, getCards, updateCard } from '@/actions/cards';
import { toast } from 'react-hot-toast';
import { CardSchema } from '@/schemas';
import { z } from 'zod';

interface Question {
  id: string;
  question: string;
  category: string;
  typeId: string;
}

// Categories for each type - using your original categories
const CATEGORIES = {
  couple: ['حبّك بهناس', 'عرّي حقيقتك', 'زيدني منّك'],
  family: ['ضحكني !', 'وقت التحدي', 'احكيلي حكاية']
};

// Types configuration
const TYPES = [
  { id: 'couple', name: 'Couple', icon: Heart },
  { id: 'family', name: 'Famille', icon: Users }
];

export default function ManageJeux() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [activeType, setActiveType] = useState<string>('couple');
  const [newQuestion, setNewQuestion] = useState<z.infer<typeof CardSchema>>({ 
    question: '', 
    category: CATEGORIES.couple[0],
    typeId: 'couple'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get current categories based on selected type
  const currentCategories = activeType === 'couple' ? CATEGORIES.couple : CATEGORIES.family;

  useEffect(() => {
    fetchCards();
  }, [activeType]);

  // Update new question's category when type changes
  useEffect(() => {
    setNewQuestion(prev => ({
      ...prev,
      category: currentCategories[0],
      typeId: activeType
    }));
    setActiveCategory('all');
  }, [activeType]);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const response = await getCards(activeType);
      if (response.success && response.data) {
        setQuestions(response.data);
      } else {
        toast.error(response.error || 'Erreur lors du chargement des cartes');
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      toast.error('Erreur lors du chargement des cartes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuestion.question.trim() || !newQuestion.category.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await addCard({
        question: newQuestion.question,
        category: newQuestion.category,
        typeId: activeType
      });

      if (response.success) {
        toast.success(response.success);
        // Reset form
        setNewQuestion({ 
          question: '', 
          category: currentCategories[0],
          typeId: activeType 
        });
        setShowAddForm(false);
        // Refresh the card list
        fetchCards();
      } else {
        toast.error(response.error || 'Erreur lors de l\'ajout de la carte');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error('Erreur lors de l\'ajout de la carte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      try {
        setIsLoading(true);
        const response = await deleteCard(id);
        if (response.success) {
          toast.success(response.success);
          setQuestions(questions.filter(q => q.id !== id));
        } else {
          toast.error(response.error || 'Erreur lors de la suppression de la carte');
        }
      } catch (error) {
        console.error('Error deleting card:', error);
        toast.error('Erreur lors de la suppression de la carte');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditCard = (question: Question) => {
    setEditingQuestion({ ...question });
  };

  const handleSaveEdit = async () => {
    if (!editingQuestion) return;

    try {
      setIsLoading(true);
      const response = await updateCard(editingQuestion.id, {
        question: editingQuestion.question,
        category: editingQuestion.category,
        typeId: editingQuestion.typeId
      });

      if (response.success) {
        toast.success(response.success);
        setQuestions(questions.map(q => q.id === editingQuestion.id ? 
          { ...editingQuestion } : q));
        setEditingQuestion(null);
      } else {
        toast.error(response.error || 'Erreur lors de la mise à jour de la carte');
      }
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Erreur lors de la mise à jour de la carte');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter questions based on active category and search term
  const filteredQuestions = questions.filter(q => {
    const matchesCategory = activeCategory === 'all' || q.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      q.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group questions by category if 'all' is selected
  const displayedQuestions = activeCategory === 'all' 
    ? currentCategories.map(category => ({
        category, 
        questions: filteredQuestions.filter(q => q.category === category)
      }))
    : [{ category: activeCategory, questions: filteredQuestions }];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Cartes</h1>
              <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez des cartes pour le jeu</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm"
              disabled={isSubmitting}
            >
              <PlusCircle size={18} className="mr-2" />
              Ajouter une carte
            </button>
          </div>

          {/* Type Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              {TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeType === type.id
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={isSubmitting}
                  >
                    <Icon size={16} className="mr-2" />
                    {type.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    activeCategory === 'all' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                {currentCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      activeCategory === category 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add New Card Form */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Ajouter une nouvelle carte {activeType === 'couple' ? 'Couple' : 'Famille'}
              </h2>
              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    id="category"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  >
                    {currentCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <textarea
                    id="question"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm flex items-center justify-center" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !showAddForm && (
            <div className="flex justify-center items-center py-12">
              <Loader2 size={40} className="animate-spin text-red-600" />
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredQuestions.length === 0 && (
            <div className="bg-white rounded-xl py-16 flex flex-col items-center justify-center text-center">
              <div className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune carte trouvée</h3>
              <p className="text-gray-500 max-w-md">
                Aucune carte ne correspond à votre recherche. Essayez de modifier vos critères de recherche ou ajoutez une nouvelle carte.
              </p>
            </div>
          )}

          {/* Questions List */}
          {!isLoading && filteredQuestions.length > 0 && (
            <div className="space-y-8">
              {displayedQuestions.map(({ category, questions }) => questions.length > 0 && (
                <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {questions.map((q) => (
                      <li key={q.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                        {editingQuestion?.id === q.id ? (
                          <div className="flex flex-col gap-3">
                            <textarea
                              value={editingQuestion.question}
                              onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              rows={2}
                            />
                            <div className="flex justify-between items-center">
                              <select
                                value={editingQuestion.category}
                                onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                {currentCategories.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <button 
                                  onClick={handleSaveEdit} 
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                  title="Enregistrer"
                                >
                                  <Save size={16} />
                                </button>
                                <button 
                                  onClick={() => setEditingQuestion(null)} 
                                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                  title="Annuler"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-800">{q.question}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditCard(q)} 
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Pencil size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCard(q.id)} 
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}