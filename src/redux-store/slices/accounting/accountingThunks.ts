import { AppDispatch, RootState } from '../../index';
import { 
  setLoading, 
  setError, 
  setChartOfAccounts, 
  setJournalEntries,
  setGeneralLedger,
  setTrialBalance,
  setSelectedAccount,
  setSelectedJournalEntry
} from './accountingSlice';
import { AccountingService } from '@/modules/accounting/services/accountingService';

export const fetchChartOfAccounts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const accounts = await AccountingService.getChartOfAccounts();
    dispatch(setChartOfAccounts(accounts));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch chart of accounts'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchAccountById = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const account = await AccountingService.getAccountById(id);
    dispatch(setSelectedAccount(account));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch account'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchJournalEntries = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const entries = await AccountingService.getJournalEntries();
    dispatch(setJournalEntries(entries));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch journal entries'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchJournalEntryById = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const entry = await AccountingService.getJournalEntryById(id);
    dispatch(setSelectedJournalEntry(entry));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch journal entry'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchGeneralLedger = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const { ledgerFilters } = getState().accounting;
    dispatch(setLoading(true));
    const ledger = await AccountingService.getGeneralLedger(ledgerFilters);
    dispatch(setGeneralLedger(ledger));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch general ledger'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTrialBalance = (asOfDate?: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const trialBalance = await AccountingService.getTrialBalance(asOfDate);
    dispatch(setTrialBalance(trialBalance));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch trial balance'));
  } finally {
    dispatch(setLoading(false));
  }
};
