import { create } from 'zustand';
import { Expense, ExpenseFilters, ExpenseCategory } from '../types';
import { ExpenseService } from '../services/expenseService';

interface ExpenseState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  categories: ExpenseCategory[];
  loading: boolean;
  error: string | null;
  filters: ExpenseFilters;
  
  // Actions
  fetchExpenses: () => Promise<void>;
  fetchExpenseById: (id: string) => Promise<void>;
  createExpense: (expenseData: any) => Promise<void>;
  updateExpense: (id: string, expenseData: any) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  approveExpense: (id: string) => Promise<void>;
  rejectExpense: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearError: () => void;
  setSelectedExpense: (expense: Expense | null) => void;
  fetchCategories: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  selectedExpense: null,
  categories: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    status: 'all',
    paymentMethod: 'all',
    dateRange: {},
    amountRange: {},
  },

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const expenses = await ExpenseService.getExpenses(get().filters);
      set({ expenses, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch expenses', loading: false });
    }
  },

  fetchExpenseById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const expense = await ExpenseService.getExpenseById(id);
      set({ selectedExpense: expense, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch expense', loading: false });
    }
  },

  createExpense: async (expenseData: any) => {
    set({ loading: true, error: null });
    try {
      const newExpense = await ExpenseService.createExpense({
        ...expenseData,
        createdBy: '1', // Mock current user ID
      });
      set(state => ({ 
        expenses: [newExpense, ...state.expenses], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create expense', loading: false });
      throw error;
    }
  },

  updateExpense: async (id: string, expenseData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedExpense = await ExpenseService.updateExpense(id, expenseData);
      set(state => ({
        expenses: state.expenses.map(expense => 
          expense.id === id ? updatedExpense : expense
        ),
        selectedExpense: state.selectedExpense?.id === id ? updatedExpense : state.selectedExpense,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update expense', loading: false });
      throw error;
    }
  },

  deleteExpense: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await ExpenseService.deleteExpense(id);
      set(state => ({
        expenses: state.expenses.filter(expense => expense.id !== id),
        selectedExpense: state.selectedExpense?.id === id ? null : state.selectedExpense,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete expense', loading: false });
      throw error;
    }
  },

  approveExpense: async (id: string) => {
    try {
      const updatedExpense = await ExpenseService.approveExpense(id, '1', 'Current User');
      set(state => ({
        expenses: state.expenses.map(expense => 
          expense.id === id ? updatedExpense : expense
        ),
        selectedExpense: state.selectedExpense?.id === id ? updatedExpense : state.selectedExpense,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to approve expense' });
      throw error;
    }
  },

  rejectExpense: async (id: string) => {
    try {
      const updatedExpense = await ExpenseService.rejectExpense(id);
      set(state => ({
        expenses: state.expenses.map(expense => 
          expense.id === id ? updatedExpense : expense
        ),
        selectedExpense: state.selectedExpense?.id === id ? updatedExpense : state.selectedExpense,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to reject expense' });
      throw error;
    }
  },

  setFilters: (filters: Partial<ExpenseFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedExpense: (expense: Expense | null) => {
    set({ selectedExpense: expense });
  },

  fetchCategories: async () => {
    try {
      const categories = await ExpenseService.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },
}));