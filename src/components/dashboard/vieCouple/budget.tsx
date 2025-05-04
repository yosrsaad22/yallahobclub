'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import {
  ArrowDown, ArrowUp, Calendar, Wallet, Plus, 
  Search, Filter, CheckCircle, XCircle, Trash2
} from 'lucide-react';
import { addTransaction, getBudgets, getTransactions, addBudget } from '@/actions/budget';
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
}

interface Budget {
  id: string;
  category: string;
  limit: number;
}

export default function BudgetPlanner() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    type: 'expense'
  });
  const [newBudget, setNewBudget] = useState<Partial<Budget>>({
    category: '',
    limit: 0
  });
  const { toast } = useToast();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const categoryOptions = ['Alimentation', 'Transport', 'Loisirs', 'Factures', 'Logement', 'Santé', 'Shopping', 'Salaire', 'Freelance', 'Autres'];

  useEffect(() => {
    fetchData();
  }, [filterMonth]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const transactionsData = await getTransactions(filterMonth);
      const budgetsData = await getBudgets();
      
      // These are now properly typed as Transaction[] and Budget[]
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
      
      // Fallback to demo data if backend is not available
      setTransactions([
        { id: '1', category: 'Alimentation', description: 'Courses', amount: 85.50, date: '2025-04-02', type: 'expense' },
        { id: '2', category: 'Transport', description: 'Essence', amount: 45.00, date: '2025-04-05', type: 'expense' },
        { id: '3', category: 'Loisirs', description: 'Cinéma', amount: 12.00, date: '2025-04-07', type: 'expense' },
        { id: '4', category: 'Factures', description: 'Électricité', amount: 65.25, date: '2025-04-10', type: 'expense' },
        { id: '5', category: 'Alimentation', description: 'Restaurant', amount: 32.00, date: '2025-04-12', type: 'expense' },
        { id: '6', category: 'Salaire', description: 'Salaire mensuel', amount: 2100.00, date: '2025-04-01', type: 'income' },
        { id: '7', category: 'Freelance', description: 'Projet web', amount: 350.00, date: '2025-04-15', type: 'income' },
      ]);
      
      setBudgets([
        { id: '1', category: 'Alimentation', limit: 400 },
        { id: '2', category: 'Transport', limit: 150 },
        { id: '3', category: 'Loisirs', limit: 100 },
        { id: '4', category: 'Factures', limit: 300 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.category || !newTransaction.description || !newTransaction.amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const newTransactionData = {
        ...newTransaction as Transaction,
        id: Date.now().toString(),
      };
      
      const result = await addTransaction(newTransactionData);
      
      if (result.success) {
        // Add the new transaction to the state
        setTransactions(prev => [...prev, result.data]);
        setNewTransaction({
          category: '',
          description: '',
          amount: 0,
          date: new Date().toISOString().slice(0, 10),
          type: 'expense'
        });
        setShowAddForm(false);
        toast({
          title: "Succès",
          description: "Transaction ajoutée avec succès",
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'ajout",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la transaction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.limit) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const newBudgetData = {
        ...newBudget as Budget,
        id: Date.now().toString()
      };
      
      const result = await addBudget(newBudgetData);
      
      if (result.success) {
        // Check if this category already exists in budgets
        const existingIndex = budgets.findIndex(b => b.category === newBudgetData.category);
        
        if (existingIndex >= 0) {
          // Update existing budget in state
          setBudgets(prev => prev.map(b => 
            b.category === newBudgetData.category ? result.data : b
          ));
        } else {
          // Add new budget to state
          setBudgets(prev => [...prev, result.data]);
        }
        
        setNewBudget({
          category: '',
          limit: 0
        });
        setShowBudgetForm(false);
        toast({
          title: "Succès",
          description: "Budget ajouté avec succès",
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'ajout",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le budget",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter(t => t.date.startsWith(filterMonth))
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { name: string; value: number }[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const budgetVsExpenses = budgets.map(b => {
    const spent = filteredTransactions.filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      category: b.category,
      budget: b.limit,
      spent,
      remaining: b.limit - spent
    };
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-indigo-800">Mon Planificateur de Budget</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 h-5 w-5 text-indigo-500" />
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="pl-10 pr-4 py-2 border border-indigo-100 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              />
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard title="Revenus" amount={totalIncome} icon={<ArrowDown className="h-6 w-6" />} color="green" />
              <SummaryCard title="Dépenses" amount={totalExpenses} icon={<ArrowUp className="h-6 w-6" />} color="red" />
              <SummaryCard
                title="Solde"
                amount={balance}
                icon={<Wallet className="h-6 w-6" />}
                color={balance >= 0 ? "blue" : "red"}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Dépenses par catégorie">
                <div className="h-full flex items-center justify-center">
                  {expensesByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie 
                          data={expensesByCategory} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80} 
                          fill="#8884d8" 
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {expensesByCategory.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value.toFixed(2)} DT`, 'Montant']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">Aucune dépense pour ce mois</p>
                  )}
                </div>
              </ChartCard>

              <ChartCard title="Budget vs Dépenses">
                <div className="h-full flex items-center justify-center">
                  {budgetVsExpenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={budgetVsExpenses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)} DT`} />
                        <Legend />
                        <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spent" name="Dépensé" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">Aucun budget défini</p>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => setShowBudgetForm(true)}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-sm"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Ajouter un budget
                  </button>
                </div>
              </ChartCard>
            </div>

            {/* Transactions List */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Transactions récentes</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                              {transaction.type === 'expense' ? '-' : '+'}{transaction.amount.toFixed(2)} DT
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              transaction.type === 'expense' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.type === 'expense' ? (
                                <ArrowUp className="mr-1 h-3 w-3"/>
                              ) : (
                                <ArrowDown className="mr-1 h-3 w-3"/>
                              )}
                              {transaction.type === 'expense' ? 'Dépense' : 'Revenu'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">Aucune transaction trouvée</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ajouter une transaction</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddTransaction}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="type"
                        checked={newTransaction.type === 'expense'}
                        onChange={() => setNewTransaction({...newTransaction, type: 'expense'})}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span>Dépense</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="type"
                        checked={newTransaction.type === 'income'}
                        onChange={() => setNewTransaction({...newTransaction, type: 'income'})}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span>Revenu</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="Description de la transaction"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (DT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount || ''}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ajouter un budget</h2>
              <button onClick={() => setShowBudgetForm(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddBudget}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoryOptions
                      .filter(cat => !['Salaire', 'Freelance', 'Autres'].includes(cat))
                      .map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite mensuelle (DT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBudget.limit || ''}
                    onChange={(e) => setNewBudget({...newBudget, limit: parseFloat(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, amount, icon, color }: { title: string; amount: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold DT{
            color === 'green' ? 'text-green-600' : 
            color === 'red' ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            {amount.toFixed(2)} DT
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-80">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}