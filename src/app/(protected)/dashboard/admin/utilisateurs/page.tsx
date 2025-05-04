"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ChevronDown, Activity, Shield, UserPlus, Check } from 'lucide-react';

// Types
type UserRole = 'admin' | 'editor' | 'viewer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
  status: 'active' | 'inactive';
}

interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
}

// Données simulées
const initialUsers: User[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean@example.com', role: 'admin', lastActive: '2025-04-29T10:23:00', status: 'active' },
  { id: '2', name: 'Marie Lambert', email: 'marie@example.com', role: 'editor', lastActive: '2025-04-28T14:45:00', status: 'active' },
  { id: '3', name: 'Pierre Martin', email: 'pierre@example.com', role: 'viewer', lastActive: '2025-04-27T09:12:00', status: 'inactive' },
  { id: '4', name: 'Sophie Lefebvre', email: 'sophie@example.com', role: 'editor', lastActive: '2025-04-29T08:30:00', status: 'active' },
];

const initialActivities: Activity[] = [
  { id: 'a1', userId: '1', action: 'Login', target: 'System', timestamp: '2025-04-29T10:23:00' },
  { id: 'a2', userId: '1', action: 'Update', target: 'User #3', timestamp: '2025-04-29T10:45:00' },
  { id: 'a3', userId: '2', action: 'Login', target: 'System', timestamp: '2025-04-28T14:45:00' },
  { id: 'a4', userId: '2', action: 'Create', target: 'Report #45', timestamp: '2025-04-28T15:30:00' },
  { id: 'a5', userId: '4', action: 'Login', target: 'System', timestamp: '2025-04-29T08:30:00' },
];

// Composant principal
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isViewingActivities, setIsViewingActivities] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'lastActive'>>(
    { name: '', email: '', role: 'viewer', status: 'active' }
  );

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtenir les activités d'un utilisateur spécifique
  const getUserActivities = (userId: string) => {
    return activities.filter(activity => activity.userId === userId);
  };

  // Ajouter un nouvel utilisateur
  const handleAddUser = () => {
    const id = `${users.length + 1}`;
    const currentDate = new Date().toISOString();
    
    setUsers([...users, {
      id,
      lastActive: currentDate,
      ...newUser
    }]);
    
    setActivities([...activities, {
      id: `a${activities.length + 1}`,
      userId: id,
      action: 'Added',
      target: 'System',
      timestamp: currentDate
    }]);
    
    setIsAddingUser(false);
    setNewUser({ name: '', email: '', role: 'viewer', status: 'active' });
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    
    setActivities([...activities, {
      id: `a${activities.length + 1}`,
      userId: '1', // ID de l'administrateur actuel
      action: 'Update',
      target: `User #${selectedUser.id}`,
      timestamp: new Date().toISOString()
    }]);
    
    setSelectedUser(null);
  };

  // Supprimer un utilisateur
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    
    setActivities([...activities, {
      id: `a${activities.length + 1}`,
      userId: '1', // ID de l'administrateur actuel
      action: 'Delete',
      target: `User #${id}`,
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les utilisateurs, leurs accès et leurs activités</p>
        </header>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Ajouter un utilisateur
            </button>
          </div>

          {/* Liste des utilisateurs */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rôle</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dernière activité</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'editor' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(user.lastActive).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button
                        onClick={() => {
                          setIsViewingActivities(true);
                          setSelectedUser(user);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600"
                        title="Voir les activités"
                      >
                        <Activity size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1 text-gray-500 hover:text-yellow-600"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'utilisateur */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Ajouter un nouvel utilisateur</h3>
              <button onClick={() => setIsAddingUser(false)} className="text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value as 'active' | 'inactive'})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button 
                onClick={() => setIsAddingUser(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification d'utilisateur */}
      {selectedUser && !isViewingActivities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Modifier l'utilisateur</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value as UserRole})}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value as 'active' | 'inactive'})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'activités utilisateur */}
      {selectedUser && isViewingActivities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Activités de {selectedUser.name}</h3>
              <button onClick={() => {
                setSelectedUser(null);
                setIsViewingActivities(false);
              }} className="text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {getUserActivities(selectedUser.id).length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Action</th>
                      <th className="text-left p-2">Cible</th>
                      <th className="text-left p-2">Date et heure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getUserActivities(selectedUser.id).map(activity => (
                      <tr key={activity.id} className="border-b">
                        <td className="p-2">{activity.action}</td>
                        <td className="p-2">{activity.target}</td>
                        <td className="p-2">{new Date(activity.timestamp).toLocaleString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-4 text-gray-500">Aucune activité enregistrée</p>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={() => {
                  setSelectedUser(null);
                  setIsViewingActivities(false);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}