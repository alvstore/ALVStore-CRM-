import { create } from 'zustand';
import { 
  ChartOfAccount, 
  JournalEntry, 
  GeneralLedgerEntry, 
  TrialBalance,
  AccountingFilters,
  GeneralLedgerFilters 
} from '../types';
import { AccountingService } from '../services/accountingService';

interface AccountingState {
  chartOfAccounts: ChartOfAccount[];
  journalEntries: JournalEntry[];
  generalLedger: GeneralLedgerEntry[];
  trialBalance: TrialBalance | null;
  selectedAccount: ChartOfAccount | null;
  selectedJournalEntry: JournalEntry | null;
  loading: boolean;
  error: string | null;
  filters: AccountingFilters;
  ledgerFilters: GeneralLedgerFilters;
  
  // Actions
  fetchChartOfAccounts: () => Promise<void>;
  fetchAccountById: (id: string) => Promise<void>;
  createAccount: (accountData: any) => Promise<void>;
  updateAccount: (id: string, accountData: any) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  fetchJournalEntries: () => Promise<void>;
  fetchJournalEntryById: (id: string) => Promise<void>;
  createJournalEntry: (entryData: any) => Promise<void>;
  postJournalEntry: (id: string) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  fetchGeneralLedger: () => Promise<void>;
  fetchTrialBalance: (asOfDate?: string) => Promise<void>;
  setFilters: (filters: Partial<AccountingFilters>) => void;
  setLedgerFilters: (filters: Partial<GeneralLedgerFilters>) => void;
  clearError: () => void;
  setSelectedAccount: (account: ChartOfAccount | null) => void;
  setSelectedJournalEntry: (entry: JournalEntry | null) => void;
}

export const useAccountingStore = create<AccountingState>((set, get) => ({
  chartOfAccounts: [],
  journalEntries: [],
  generalLedger: [],
  trialBalance: null,
  selectedAccount: null,
  selectedJournalEntry: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    status: 'all',
    dateRange: {},
  },
  ledgerFilters: {
    search: '',
    accountId: 'all',
    dateRange: {},
  },

  fetchChartOfAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const chartOfAccounts = await AccountingService.getChartOfAccounts(get().filters);
      set({ chartOfAccounts, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch chart of accounts', loading: false });
    }
  },

  fetchAccountById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const account = await AccountingService.getAccountById(id);
      set({ selectedAccount: account, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch account', loading: false });
    }
  },

  createAccount: async (accountData: any) => {
    set({ loading: true, error: null });
    try {
      const newAccount = await AccountingService.createAccount(accountData);
      set(state => ({ 
        chartOfAccounts: [...state.chartOfAccounts, newAccount], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create account', loading: false });
      throw error;
    }
  },

  updateAccount: async (id: string, accountData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedAccount = await AccountingService.updateAccount(id, accountData);
      set(state => ({
        chartOfAccounts: state.chartOfAccounts.map(account => 
          account.id === id ? updatedAccount : account
        ),
        selectedAccount: state.selectedAccount?.id === id ? updatedAccount : state.selectedAccount,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update account', loading: false });
      throw error;
    }
  },

  deleteAccount: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await AccountingService.deleteAccount(id);
      set(state => ({
        chartOfAccounts: state.chartOfAccounts.filter(account => account.id !== id),
        selectedAccount: state.selectedAccount?.id === id ? null : state.selectedAccount,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete account', loading: false });
      throw error;
    }
  },

  fetchJournalEntries: async () => {
    set({ loading: true, error: null });
    try {
      const journalEntries = await AccountingService.getJournalEntries(get().filters);
      set({ journalEntries, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch journal entries', loading: false });
    }
  },

  fetchJournalEntryById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const entry = await AccountingService.getJournalEntryById(id);
      set({ selectedJournalEntry: entry, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch journal entry', loading: false });
    }
  },

  createJournalEntry: async (entryData: any) => {
    set({ loading: true, error: null });
    try {
      const newEntry = await AccountingService.createJournalEntry({
        ...entryData,
        createdBy: '1', // Mock current user ID
      });
      set(state => ({ 
        journalEntries: [newEntry, ...state.journalEntries], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create journal entry', loading: false });
      throw error;
    }
  },

  postJournalEntry: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedEntry = await AccountingService.postJournalEntry(id);
      set(state => ({
        journalEntries: state.journalEntries.map(entry => 
          entry.id === id ? updatedEntry : entry
        ),
        selectedJournalEntry: state.selectedJournalEntry?.id === id ? updatedEntry : state.selectedJournalEntry,
        loading: false
      }));
      
      // Refresh chart of accounts to reflect updated balances
      const chartOfAccounts = await AccountingService.getChartOfAccounts(get().filters);
      set({ chartOfAccounts });
      
      // Refresh general ledger
      const generalLedger = await AccountingService.getGeneralLedger(get().ledgerFilters);
      set({ generalLedger });
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to post journal entry', loading: false });
      throw error;
    }
  },

  deleteJournalEntry: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await AccountingService.deleteJournalEntry(id);
      set(state => ({
        journalEntries: state.journalEntries.filter(entry => entry.id !== id),
        selectedJournalEntry: state.selectedJournalEntry?.id === id ? null : state.selectedJournalEntry,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete journal entry', loading: false });
      throw error;
    }
  },

  fetchGeneralLedger: async () => {
    set({ loading: true, error: null });
    try {
      const generalLedger = await AccountingService.getGeneralLedger(get().ledgerFilters);
      set({ generalLedger, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch general ledger', loading: false });
    }
  },

  fetchTrialBalance: async (asOfDate?: string) => {
    set({ loading: true, error: null });
    try {
      const trialBalance = await AccountingService.getTrialBalance(asOfDate);
      set({ trialBalance, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch trial balance', loading: false });
    }
  },

  setFilters: (filters: Partial<AccountingFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  setLedgerFilters: (filters: Partial<GeneralLedgerFilters>) => {
    set(state => ({
      ledgerFilters: { ...state.ledgerFilters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedAccount: (account: ChartOfAccount | null) => {
    set({ selectedAccount: account });
  },

  setSelectedJournalEntry: (entry: JournalEntry | null) => {
    set({ selectedJournalEntry: entry });
  },
}));