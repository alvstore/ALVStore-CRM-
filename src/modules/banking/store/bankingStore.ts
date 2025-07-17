import { create } from 'zustand';
import { BankAccount, BankTransaction, JournalEntry, BankingFilters } from '../types';
import { BankingService } from '../services/bankingService';

interface BankingState {
  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
  journalEntries: JournalEntry[];
  selectedAccount: BankAccount | null;
  loading: boolean;
  error: string | null;
  filters: BankingFilters;
  
  // Actions
  fetchBankAccounts: () => Promise<void>;
  fetchBankAccountById: (id: string) => Promise<void>;
  createBankAccount: (accountData: any) => Promise<void>;
  updateBankAccount: (id: string, accountData: any) => Promise<void>;
  deleteBankAccount: (id: string) => Promise<void>;
  fetchBankTransactions: () => Promise<void>;
  createTransaction: (transactionData: any) => Promise<void>;
  fetchJournalEntries: () => Promise<void>;
  setFilters: (filters: Partial<BankingFilters>) => void;
  clearError: () => void;
  setSelectedAccount: (account: BankAccount | null) => void;
}

export const useBankingStore = create<BankingState>((set, get) => ({
  bankAccounts: [],
  bankTransactions: [],
  journalEntries: [],
  selectedAccount: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    accountId: 'all',
    type: 'all',
    category: 'all',
    dateRange: {},
    amountRange: {},
  },

  fetchBankAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const bankAccounts = await BankingService.getBankAccounts();
      set({ bankAccounts, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch bank accounts', loading: false });
    }
  },

  fetchBankAccountById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const account = await BankingService.getBankAccountById(id);
      set({ selectedAccount: account, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch bank account', loading: false });
    }
  },

  createBankAccount: async (accountData: any) => {
    set({ loading: true, error: null });
    try {
      const newAccount = await BankingService.createBankAccount(accountData);
      set(state => ({ 
        bankAccounts: [...state.bankAccounts, newAccount], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create bank account', loading: false });
      throw error;
    }
  },

  updateBankAccount: async (id: string, accountData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedAccount = await BankingService.updateBankAccount(id, accountData);
      set(state => ({
        bankAccounts: state.bankAccounts.map(account => 
          account.id === id ? updatedAccount : account
        ),
        selectedAccount: state.selectedAccount?.id === id ? updatedAccount : state.selectedAccount,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update bank account', loading: false });
      throw error;
    }
  },

  deleteBankAccount: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await BankingService.deleteBankAccount(id);
      set(state => ({
        bankAccounts: state.bankAccounts.filter(account => account.id !== id),
        selectedAccount: state.selectedAccount?.id === id ? null : state.selectedAccount,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete bank account', loading: false });
      throw error;
    }
  },

  fetchBankTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const bankTransactions = await BankingService.getBankTransactions(get().filters);
      set({ bankTransactions, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch bank transactions', loading: false });
    }
  },

  createTransaction: async (transactionData: any) => {
    set({ loading: true, error: null });
    try {
      const newTransactions = await BankingService.createTransaction(transactionData);
      
      // Refresh accounts to get updated balances
      const bankAccounts = await BankingService.getBankAccounts();
      
      set(state => ({ 
        bankTransactions: [...newTransactions, ...state.bankTransactions],
        bankAccounts,
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create transaction', loading: false });
      throw error;
    }
  },

  fetchJournalEntries: async () => {
    try {
      const journalEntries = await BankingService.getJournalEntries();
      set({ journalEntries });
    } catch (error) {
      console.error('Failed to fetch journal entries:', error);
    }
  },

  setFilters: (filters: Partial<BankingFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedAccount: (account: BankAccount | null) => {
    set({ selectedAccount: account });
  },
}));