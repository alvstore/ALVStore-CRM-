import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ChartOfAccount, 
  JournalEntry, 
  GeneralLedgerEntry, 
  TrialBalance,
  AccountingFilters,
  GeneralLedgerFilters 
} from '@/modules/accounting/types';
import { AccountingService } from '@/modules/accounting/services/accountingService';

// Async Thunks
export const fetchChartOfAccounts = createAsyncThunk(
  'accounting/fetchChartOfAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AccountingService.getChartOfAccounts();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch chart of accounts');
    }
  }
);

export const fetchJournalEntries = createAsyncThunk(
  'accounting/fetchJournalEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AccountingService.getJournalEntries();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch journal entries');
    }
  }
);

export const fetchGeneralLedger = createAsyncThunk(
  'accounting/fetchGeneralLedger',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AccountingService.getGeneralLedger();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch general ledger');
    }
  }
);

export const fetchTrialBalance = createAsyncThunk(
  'accounting/fetchTrialBalance',
  async (asOfDate: string | undefined, { rejectWithValue }) => {
    try {
      const response = await AccountingService.getTrialBalance(asOfDate);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch trial balance');
    }
  }
);

export const fetchAccountById = createAsyncThunk(
  'accounting/fetchAccountById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AccountingService.getAccountById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch account');
    }
  }
);

export const fetchJournalEntryById = createAsyncThunk(
  'accounting/fetchJournalEntryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AccountingService.getJournalEntryById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch journal entry');
    }
  }
);

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
}

const initialState: AccountingState = {
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
    type: '',
    category: '',
    status: '',
    dateRange: {
      start: '',
      end: ''
    }
  },
  ledgerFilters: {
    search: '',
    accountId: '',
    dateRange: {
      start: '',
      end: ''
    }
  }
};

const accountingSlice = createSlice({
  name: 'accounting',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setChartOfAccounts: (state, action: PayloadAction<ChartOfAccount[]>) => {
      state.chartOfAccounts = action.payload;
    },
    setJournalEntries: (state, action: PayloadAction<JournalEntry[]>) => {
      state.journalEntries = action.payload;
    },
    setGeneralLedger: (state, action: PayloadAction<GeneralLedgerEntry[]>) => {
      state.generalLedger = action.payload;
    },
    setTrialBalance: (state, action: PayloadAction<TrialBalance | null>) => {
      state.trialBalance = action.payload;
    },
    setSelectedAccount: (state, action: PayloadAction<ChartOfAccount | null>) => {
      state.selectedAccount = action.payload;
    },
    setSelectedJournalEntry: (state, action: PayloadAction<JournalEntry | null>) => {
      state.selectedJournalEntry = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AccountingFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLedgerFilters: (state, action: PayloadAction<Partial<GeneralLedgerFilters>>) => {
      state.ledgerFilters = { ...state.ledgerFilters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSelectedAccount: (state) => {
      state.selectedAccount = null;
    },
    resetSelectedJournalEntry: (state) => {
      state.selectedJournalEntry = null;
    },
  }
});

export const {
  setLoading,
  setError,
  setChartOfAccounts,
  setJournalEntries,
  setGeneralLedger,
  setTrialBalance,
  setSelectedAccount,
  setSelectedJournalEntry,
  setFilters,
  setLedgerFilters,
  clearError,
  resetSelectedAccount,
  resetSelectedJournalEntry
} = accountingSlice.actions;

export default accountingSlice.reducer;
