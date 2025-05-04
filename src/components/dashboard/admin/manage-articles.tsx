'use client';
import React, { useEffect, useState } from 'react';
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/actions/article';
import { Heart, Users, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string; // Changed from category to categoryId
  typeId: string;
}

const CATEGORIES = {
  couple: ['حبّك بهناس', 'عرّي حقيقتك', 'زيدني منّك'],
  family: ['ضحكني !', 'وقت التحدي', 'احكيلي حكاية']
};

const TYPES = [
  { id: 'couple', name: 'Couple', icon: Heart },
  { id: 'family', name: 'Famille', icon: Users }
];

export default function ManageArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeType, setActiveType] = useState<string>('couple');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [newArticle, setNewArticle] = useState({ 
    title: '', 
    description: '', 
    image: '', 
    categoryId: CATEGORIES.couple[0], // Changed from category to categoryId
    typeId: 'couple'
  });
  const [search, setSearch] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const currentCategories = activeType === 'couple' ? CATEGORIES.couple : CATEGORIES.family;

  useEffect(() => {
    fetchArticles();
  }, [activeType]);

  useEffect(() => {
    setNewArticle(prev => ({ 
      ...prev, 
      categoryId: currentCategories[0], // Changed from category to categoryId
      typeId: activeType 
    }));
    setActiveCategory('all');
  }, [activeType]);

  const fetchArticles = async () => {
    const res = await getArticles();
    if (res.success) {
      setArticles(res.data);
    } else {
      toast.error(res.error || 'Erreur lors du chargement');
    }
  };

  const handleAdd = async () => {
    if (!newArticle.title || !newArticle.description || !newArticle.image) return toast.error('Champs obligatoires !');
    const res = await createArticle(newArticle);
    if (res.success) {
      toast.success('Article ajouté');
      setArticles([...articles, res.data]);
      setNewArticle({ 
        title: '', 
        description: '', 
        image: '', 
        categoryId: currentCategories[0], // Changed from category to categoryId
        typeId: activeType 
      });
    } else toast.error(res.error || 'Erreur');
  };

  const handleUpdate = async () => {
    if (!editingArticle) return;
    const res = await updateArticle(editingArticle.id, editingArticle);
    if (res.success) {
      toast.success('Article mis à jour');
      setArticles(articles.map(a => (a.id === editingArticle.id ? editingArticle : a)));
      setEditingArticle(null);
    } else toast.error(res.error || 'Erreur');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet article ?')) {
      const res = await deleteArticle(id);
      if (res.success) {
        toast.success('Supprimé');
        setArticles(articles.filter(a => a.id !== id));
      } else toast.error(res.error || 'Erreur');
    }
  };

  const filtered = articles.filter(a =>
    (activeCategory === 'all' || a.categoryId === activeCategory) && // Changed from category to categoryId
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-xl">
      {/* Type Switch */}
      <div className="flex gap-4 mb-6">
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setActiveType(t.id)} className={`px-4 py-2 rounded-md ${activeType === t.id ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
            <t.icon className="inline mr-2" size={16} /> {t.name}
          </button>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Recherche..." value={search} onChange={e => setSearch(e.target.value)} className="border px-4 py-2 rounded w-full" />
        <select value={activeCategory} onChange={e => setActiveCategory(e.target.value)} className="border px-4 py-2 rounded">
          <option value="all">Toutes</option>
          {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Add Article */}
      <div className="mb-4 space-y-2">
        <input placeholder="Titre" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} className="border px-4 py-2 rounded w-full" />
        <textarea placeholder="Description" value={newArticle.description} onChange={e => setNewArticle({ ...newArticle, description: e.target.value })} className="border px-4 py-2 rounded w-full" />
        <input placeholder="Lien image" value={newArticle.image} onChange={e => setNewArticle({ ...newArticle, image: e.target.value })} className="border px-4 py-2 rounded w-full" />
        <select 
          value={newArticle.categoryId} 
          onChange={e => setNewArticle({ ...newArticle, categoryId: e.target.value })} 
          className="border px-4 py-2 rounded"
        >
          {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded"><PlusCircle className="inline mr-2" size={16} />Ajouter</button>
      </div>

      {/* Article List */}
      {filtered.map(article => (
        <div key={article.id} className="border p-4 rounded-lg mb-4 flex justify-between">
          <div>
            <h3 className="font-semibold">{article.title}</h3>
            <p>{article.description}</p>
            <small className="text-gray-500">{article.categoryId}</small> {/* Changed from category to categoryId */}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditingArticle(article)}><Pencil size={16} /></button>
            <button onClick={() => handleDelete(article.id)}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier l'article</h2>
            <input value={editingArticle.title} onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })} className="border mb-2 w-full px-4 py-2 rounded" />
            <textarea value={editingArticle.description} onChange={e => setEditingArticle({ ...editingArticle, description: e.target.value })} className="border mb-2 w-full px-4 py-2 rounded" />
            <input value={editingArticle.image} onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })} className="border mb-2 w-full px-4 py-2 rounded" />
            <select 
              value={editingArticle.categoryId} 
              onChange={e => setEditingArticle({ ...editingArticle, categoryId: e.target.value })} 
              className="border w-full px-4 py-2 rounded mb-2"
            >
              {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingArticle(null)} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
              <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-600 text-white">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}