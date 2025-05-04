'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

function getUserId() {
  const cookieStore = cookies();
  let userId = cookieStore.get('budget_user_id')?.value;
  
  if (!userId) {
    userId = 'user_' + Date.now().toString();
    cookies().set('budget_user_id', userId, { 
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
    });
  }
  
  return userId;
}

async function getStoredData<T>(key: string): Promise<T[]> {
  // In a real app, this would fetch from a database
  // For now, simulate server-side storage with a global object
  // @ts-ignore - This is a simulation
  global.budgetData = global.budgetData || {};
  
  const userId = getUserId();
  const storageKey = `${userId}_${key}`;
  
  // @ts-ignore - This is a simulation
  return global.budgetData[storageKey] || [];
}

async function setStoredData<T>(key: string, data: T[]): Promise<void> {
  // In a real app, this would save to a database
  // @ts-ignore - This is a simulation
  global.budgetData = global.budgetData || {};
  
  const userId = getUserId();
  const storageKey = `${userId}_${key}`;
  
  // @ts-ignore - This is a simulation
  global.budgetData[storageKey] = data;
}

// Get transactions (filtered by month if provided)
export async function getTransactions(month?: string): Promise<Transaction[]> {
  try {
    const transactions = await getStoredData<Transaction>('transactions');
    
    // Initialize with demo data if empty
    if (transactions.length === 0) {
      const demoData: Transaction[] = [
        { id: '1', category: 'Alimentation', description: 'Courses', amount: 85.50, date: '2025-04-02', type: 'expense' },
        { id: '2', category: 'Transport', description: 'Essence', amount: 45.00, date: '2025-04-05', type: 'expense' },
        { id: '3', category: 'Loisirs', description: 'Cinéma', amount: 12.00, date: '2025-04-07', type: 'expense' },
        { id: '4', category: 'Factures', description: 'Électricité', amount: 65.25, date: '2025-04-10', type: 'expense' },
        { id: '5', category: 'Alimentation', description: 'Restaurant', amount: 32.00, date: '2025-04-12', type: 'expense' },
        { id: '6', category: 'Salaire', description: 'Salaire mensuel', amount: 2100.00, date: '2025-04-01', type: 'income' },
        { id: '7', category: 'Freelance', description: 'Projet web', amount: 350.00, date: '2025-04-15', type: 'income' },
      ];
      await setStoredData('transactions', demoData);
      return month ? demoData.filter(t => t.date.startsWith(month)) : demoData;
    }
    
    return month ? transactions.filter(t => t.date.startsWith(month)) : transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

// Get budgets
export async function getBudgets(): Promise<Budget[]> {
  try {
    const budgets = await getStoredData<Budget>('budgets');
    
    // Initialize with demo data if empty
    if (budgets.length === 0) {
      const demoData: Budget[] = [
        { id: '1', category: 'Alimentation', limit: 400 },
        { id: '2', category: 'Transport', limit: 150 },
        { id: '3', category: 'Loisirs', limit: 100 },
        { id: '4', category: 'Factures', limit: 300 },
      ];
      await setStoredData('budgets', demoData);
      return demoData;
    }
    
    return budgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}

// Add a new transaction
export async function addTransaction(transaction: Transaction): Promise<ApiResponse<Transaction>> {
  try {
    const transactions = await getStoredData<Transaction>('transactions');
    transactions.push(transaction);
    await setStoredData('transactions', transactions);
    
    revalidatePath('/budget');
    
    return {
      success: true,
      data: transaction
    };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return {
      success: false,
      data: transaction,
      error: "Failed to add transaction"
    };
  }
}

// Add a new budget
export async function addBudget(budget: Budget): Promise<ApiResponse<Budget>> {
  try {
    const budgets = await getStoredData<Budget>('budgets');
    
    // Check if budget for this category already exists
    const existingIndex = budgets.findIndex(b => b.category === budget.category);
    if (existingIndex >= 0) {
      // Update existing budget
      budgets[existingIndex] = budget;
    } else {
      // Add new budget
      budgets.push(budget);
    }
    
    await setStoredData('budgets', budgets);
    
    revalidatePath('/budget');
    
    return {
      success: true,
      data: budget
    };
  } catch (error) {
    console.error("Error adding budget:", error);
    return {
      success: false,
      data: budget,
      error: "Failed to add budget"
    };
  }
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<ApiResponse<string>> {
  try {
    const transactions = await getStoredData<Transaction>('transactions');
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await setStoredData('transactions', updatedTransactions);
    
    revalidatePath('/budget');
    
    return {
      success: true,
      data: id
    };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return {
      success: false,
      data: id,
      error: "Failed to delete transaction"
    };
  }
}

// Delete a budget
export async function deleteBudget(id: string): Promise<ApiResponse<string>> {
  try {
    const budgets = await getStoredData<Budget>('budgets');
    const updatedBudgets = budgets.filter(b => b.id !== id);
    await setStoredData('budgets', updatedBudgets);
    
    revalidatePath('/budget');
    
    return {
      success: true,
      data: id
    };
  } catch (error) {
    console.error("Error deleting budget:", error);
    return {
      success: false,
      data: id,
      error: "Failed to delete budget"
    };
  }
}