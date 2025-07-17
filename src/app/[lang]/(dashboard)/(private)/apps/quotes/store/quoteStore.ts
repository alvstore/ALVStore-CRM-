import { create } from 'zustand';
import { Quote, QuoteFilters } from '../types';
import { QuoteService } from '../services/quoteService';

interface QuoteState {
  quotes: Quote[];
  selectedQuote: Quote | null;
  loading: boolean;
  error: string | null;
  filters: QuoteFilters;
  clients: Array<{ id: string; name: string; email: string }>;
  
  // Actions
  fetchQuotes: () => Promise<void>;
  fetchQuoteById: (id: string) => Promise<void>;
  createQuote: (quoteData: any) => Promise<void>;
  updateQuote: (id: string, quoteData: any) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  convertToInvoice: (data: any) => Promise<{ success: boolean; invoiceId: string }>;
  updateQuoteStatus: (id: string, status: Quote['status']) => Promise<void>;
  setFilters: (filters: Partial<QuoteFilters>) => void;
  clearError: () => void;
  setSelectedQuote: (quote: Quote | null) => void;
  fetchClients: () => Promise<void>;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],
  selectedQuote: null,
  loading: false,
  error: null,
  clients: [],
  filters: {
    search: '',
    status: 'all',
    clientId: 'all',
    dateRange: {},
  },

  fetchQuotes: async () => {
    set({ loading: true, error: null });
    try {
      const quotes = await QuoteService.getQuotes(get().filters);
      set({ quotes, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch quotes', loading: false });
    }
  },

  fetchQuoteById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const quote = await QuoteService.getQuoteById(id);
      set({ selectedQuote: quote, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch quote', loading: false });
    }
  },

  createQuote: async (quoteData: any) => {
    set({ loading: true, error: null });
    try {
      const newQuote = await QuoteService.createQuote(quoteData);
      set(state => ({ 
        quotes: [newQuote, ...state.quotes], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create quote', loading: false });
      throw error;
    }
  },

  updateQuote: async (id: string, quoteData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedQuote = await QuoteService.updateQuote(id, quoteData);
      set(state => ({
        quotes: state.quotes.map(quote => 
          quote.id === id ? updatedQuote : quote
        ),
        selectedQuote: state.selectedQuote?.id === id ? updatedQuote : state.selectedQuote,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update quote', loading: false });
      throw error;
    }
  },

  deleteQuote: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await QuoteService.deleteQuote(id);
      set(state => ({
        quotes: state.quotes.filter(quote => quote.id !== id),
        selectedQuote: state.selectedQuote?.id === id ? null : state.selectedQuote,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete quote', loading: false });
      throw error;
    }
  },

  convertToInvoice: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const result = await QuoteService.convertToInvoice(data);
      // Update the quote to mark as converted
      set(state => ({
        quotes: state.quotes.map(quote => 
          quote.id === data.quoteId 
            ? { ...quote, convertedToInvoice: true, invoiceId: result.invoiceId }
            : quote
        ),
        loading: false
      }));
      return result;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to convert quote', loading: false });
      throw error;
    }
  },

  updateQuoteStatus: async (id: string, status: Quote['status']) => {
    try {
      const updatedQuote = await QuoteService.updateQuoteStatus(id, status);
      set(state => ({
        quotes: state.quotes.map(quote => 
          quote.id === id ? updatedQuote : quote
        ),
        selectedQuote: state.selectedQuote?.id === id ? updatedQuote : state.selectedQuote,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update quote status' });
      throw error;
    }
  },

  setFilters: (filters: Partial<QuoteFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedQuote: (quote: Quote | null) => {
    set({ selectedQuote: quote });
  },

  fetchClients: async () => {
    try {
      const clients = await QuoteService.getClients();
      set({ clients });
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  },
}));