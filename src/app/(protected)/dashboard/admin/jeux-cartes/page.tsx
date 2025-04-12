'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  categoryId: string;
}

interface Category {
  id: string;
  title: string;
  questions: Question[];
}

const dummyCategories: Category[] = [
  {
    id: '1',
    title: 'حبّك بهناس',
    questions: [
      { id: '1', question: 'شنوا تتفكر من أول مرة خرجنا فيها مع بعضنا ?', categoryId: '1' },
      { id: '2', question: 'حسب رايك شنيا أحسن هدية جاتني من عندك ?', categoryId: '1' },
    ],
  },
  {
    id: '2',
    title: 'عرّي حقيقتك',
    questions: [
      { id: '3', question: 'شنوا أكثر تجارب مستك في حياتك?', categoryId: '2' },
    ],
  },
];

export default function JeuxCartesAdmin() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [editIndex, setEditIndex] = useState<{ catIndex: number; qIndex: number } | null>(null);
  const [newQuestion, setNewQuestion] = useState('');

  const handleDeleteQuestion = (catIndex: number, qIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[catIndex].questions.splice(qIndex, 1);
    setCategories(updatedCategories);
  };

  const handleAddQuestion = async (catIndex: number) => {
    const question = prompt('Entrez la nouvelle question');
    if (question) {
      const categoryId = categories[catIndex].id;

      // Make API request to add the question to the server
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId, question }),
      });

      if (response.ok) {
        const newQuestionData = await response.json();
        const updatedCategories = [...categories];
        updatedCategories[catIndex].questions.push(newQuestionData);
        setCategories(updatedCategories);
      } else {
        alert('Failed to add the question');
      }
    }
  };

  const handleEditQuestion = (catIndex: number, qIndex: number, currentQuestion: string) => {
    setEditIndex({ catIndex, qIndex });
    setNewQuestion(currentQuestion);
  };

  const handleSaveEdit = () => {
    if (editIndex) {
      const updatedCategories = [...categories];
      updatedCategories[editIndex.catIndex].questions[editIndex.qIndex].question = newQuestion;
      setCategories(updatedCategories);
      setEditIndex(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-red-700">🧩 Gestion des Cartes Couples</h1>

      {categories.map((category, catIndex) => (
        <div key={catIndex} className="mb-8 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">{category.title}</h2>

          <ul className="space-y-3">
            {category.questions.map((question, qIndex) => (
              <li
                key={qIndex}
                className="bg-gray-100 px-4 py-2 rounded-lg flex justify-between items-center"
              >
                {editIndex?.catIndex === catIndex && editIndex.qIndex === qIndex ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="px-2 py-1 rounded border"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-500 hover:text-green-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                ) : (
                  <span className="text-sm">{question.question}</span>
                )}
                <div className="space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditQuestion(catIndex, qIndex, question.question)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteQuestion(catIndex, qIndex)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="mt-4 inline-flex items-center text-sm text-green-600 hover:underline"
            onClick={() => handleAddQuestion(catIndex)}
          >
            <PlusCircle size={18} className="mr-1" />
            Ajouter une nouvelle question
          </button>
        </div>
      ))}
    </div>
  );
}
