'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { JournalEntry, JournalEntryFormData, ChartOfAccount } from '../types';

interface AccountingFilters {
  startDate?: string;
  endDate?: string;
  status?: 'draft' | 'posted' | 'reversed' | '';
  reference?: string;
  accountId?: string;
}

export const useAccountingStore = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AccountingFilters>({
    search: '',
    status: 'all',
    dateRange: {
      start: undefined,
      end: undefined
    }
  });

  // Mock data fetch function - replace with actual API calls
  const fetchJournalEntries = useCallback(async (filters: AccountingFilters = {}) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/api/accounting/journal-entries', { params: filters });
      // setJournalEntries(response.data);
      
      // Mock data for now
      const mockEntries: JournalEntry[] = [];
      setJournalEntries(mockEntries);
    } catch (err) {
      setError('Failed to fetch journal entries');
      enqueueSnackbar('Failed to fetch journal entries', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const fetchChartOfAccounts = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/api/accounting/chart-of-accounts');
      // setChartOfAccounts(response.data);
      
      // Mock data for now
      const mockAccounts: ChartOfAccount[] = [];
      setChartOfAccounts(mockAccounts);
    } catch (err) {
      setError('Failed to fetch chart of accounts');
      enqueueSnackbar('Failed to fetch chart of accounts', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const createJournalEntry = useCallback(async (data: JournalEntryFormData): Promise<boolean> => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.post('/api/accounting/journal-entries', data);
      // setJournalEntries(prev => [...prev, response.data]);
      
      enqueueSnackbar('Journal entry created successfully', { variant: 'success' });
      return true;
    } catch (err) {
      setError('Failed to create journal entry');
      enqueueSnackbar('Failed to create journal entry', { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const postJournalEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await api.post(`/api/accounting/journal-entries/${id}/post`);
      
      setJournalEntries(prev => 
        prev.map(entry => 
          entry.id === id ? { ...entry, status: 'posted', postedAt: new Date().toISOString() } : entry
        )
      );
      
      enqueueSnackbar('Journal entry posted successfully', { variant: 'success' });
      return true;
    } catch (err) {
      setError('Failed to post journal entry');
      enqueueSnackbar('Failed to post journal entry', { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const deleteJournalEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await api.delete(`/api/accounting/journal-entries/${id}`);
      
      setJournalEntries(prev => prev.filter(entry => entry.id !== id));
      enqueueSnackbar('Journal entry deleted successfully', { variant: 'success' });
      return true;
    } catch (err) {
      setError('Failed to delete journal entry');
      enqueueSnackbar('Failed to delete journal entry', { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Load initial data
  useEffect(() => {
    fetchJournalEntries(filters);
    fetchChartOfAccounts();
  }, [fetchJournalEntries, fetchChartOfAccounts, filters]);

  return {
    // State
    journalEntries,
    chartOfAccounts,
    loading,
    error,
    filters,
    
    // Actions
    fetchJournalEntries,
    fetchChartOfAccounts,
    createJournalEntry,
    postJournalEntry,
    deleteJournalEntry,
    setFilters,
  };
};

export default useAccountingStore;
