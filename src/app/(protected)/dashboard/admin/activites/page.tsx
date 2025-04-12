'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';

interface Activite {
  id: string;
  name: string;
  place: string;
  mood: string;
  style: string;
  budget: string;
}

export default function AdminActivites() {
  const [activities, setActivities] = useState<Activite[]>([]);

  useEffect(() => {
    setActivities([
      {
        id: '1',
        name: 'خروج للبحر',
        place: 'المرسى',
        mood: 'رومانسي',
        style: 'خارجي',
        budget: 'متوسط'
      },
      {
        id: '2',
        name: 'سهرة ألعاب في المنزل',
        place: 'المنزل',
        mood: 'مرح',
        style: 'داخلي',
        budget: 'منخفض'
      }
    ]);
  }, []);

  const handleDelete = (id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
    // Replace with DELETE API call
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gérer les Activités</h1>
        <Button className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Ajouter une activité
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map(act => (
          <Card key={act.id} className="p-4">
            <CardContent className="space-y-2">
              <h3 className="font-semibold text-red-600">{act.name}</h3>
              <p>📍 {act.place}</p>
              <p>🎭 {act.mood} | 🧑‍🎨 {act.style}</p>
              <p>💸 {act.budget}</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(act.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
