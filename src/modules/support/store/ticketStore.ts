import { create } from 'zustand';
import { SupportTicket, TicketComment, TicketFilters, TicketCategory } from '../types';
import { TicketService } from '../services/ticketService';

interface TicketState {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  ticketComments: TicketComment[];
  categories: TicketCategory[];
  loading: boolean;
  error: string | null;
  filters: TicketFilters;
  
  // Actions
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (ticketData: any) => Promise<void>;
  updateTicket: (id: string, ticketData: any) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  fetchTicketComments: (ticketId: string) => Promise<void>;
  addTicketComment: (ticketId: string, commentData: any) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilters: (filters: Partial<TicketFilters>) => void;
  clearError: () => void;
  setSelectedTicket: (ticket: SupportTicket | null) => void;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  selectedTicket: null,
  ticketComments: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    category: 'all',
    clientId: 'all',
    dateRange: {},
  },

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const tickets = await TicketService.getTickets(get().filters);
      set({ tickets, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tickets', loading: false });
    }
  },

  fetchTicketById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const ticket = await TicketService.getTicketById(id);
      set({ selectedTicket: ticket, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch ticket', loading: false });
    }
  },

  createTicket: async (ticketData: any) => {
    set({ loading: true, error: null });
    try {
      const newTicket = await TicketService.createTicket(ticketData);
      set(state => ({ 
        tickets: [newTicket, ...state.tickets], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create ticket', loading: false });
      throw error;
    }
  },

  updateTicket: async (id: string, ticketData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedTicket = await TicketService.updateTicket(id, ticketData);
      set(state => ({
        tickets: state.tickets.map(ticket => 
          ticket.id === id ? updatedTicket : ticket
        ),
        selectedTicket: state.selectedTicket?.id === id ? updatedTicket : state.selectedTicket,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update ticket', loading: false });
      throw error;
    }
  },

  deleteTicket: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await TicketService.deleteTicket(id);
      set(state => ({
        tickets: state.tickets.filter(ticket => ticket.id !== id),
        selectedTicket: state.selectedTicket?.id === id ? null : state.selectedTicket,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete ticket', loading: false });
      throw error;
    }
  },

  fetchTicketComments: async (ticketId: string) => {
    set({ loading: true, error: null });
    try {
      const comments = await TicketService.getTicketComments(ticketId);
      set({ ticketComments: comments, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch ticket comments', loading: false });
    }
  },

  addTicketComment: async (ticketId: string, commentData: any) => {
    set({ loading: true, error: null });
    try {
      const newComment = await TicketService.addTicketComment(ticketId, commentData);
      set(state => ({ 
        ticketComments: [...state.ticketComments, newComment], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add comment', loading: false });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await TicketService.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  setFilters: (filters: Partial<TicketFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedTicket: (ticket: SupportTicket | null) => {
    set({ selectedTicket: ticket });
  },
}));