import { create } from 'zustand';
import { Lead, LeadFilters, KanbanColumn } from '../types';
import { LeadService } from '../services/leadService';

interface LeadState {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
  filters: LeadFilters;
  staff: Array<{ id: string; name: string; role: string }>;
  
  // Actions
  fetchLeads: () => Promise<void>;
  fetchLeadById: (id: string) => Promise<void>;
  createLead: (leadData: any) => Promise<void>;
  updateLead: (id: string, leadData: any) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertToClient: (leadId: string) => Promise<{ success: boolean; clientId: string }>;
  setFilters: (filters: Partial<LeadFilters>) => void;
  clearError: () => void;
  setSelectedLead: (lead: Lead | null) => void;
  fetchStaff: () => Promise<void>;
  
  // Kanban specific
  getKanbanColumns: () => KanbanColumn[];
  moveLeadToStatus: (leadId: string, newStatus: Lead['status']) => Promise<void>;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,
  staff: [],
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    source: 'all',
    tags: [],
    dateRange: {},
  },

  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      const leads = await LeadService.getLeads(get().filters);
      set({ leads, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch leads', loading: false });
    }
  },

  fetchLeadById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const lead = await LeadService.getLeadById(id);
      set({ selectedLead: lead, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch lead', loading: false });
    }
  },

  createLead: async (leadData: any) => {
    set({ loading: true, error: null });
    try {
      const newLead = await LeadService.createLead(leadData);
      set(state => ({ 
        leads: [...state.leads, newLead], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create lead', loading: false });
      throw error;
    }
  },

  updateLead: async (id: string, leadData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedLead = await LeadService.updateLead(id, leadData);
      set(state => ({
        leads: state.leads.map(lead => 
          lead.id === id ? updatedLead : lead
        ),
        selectedLead: state.selectedLead?.id === id ? updatedLead : state.selectedLead,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update lead', loading: false });
      throw error;
    }
  },

  deleteLead: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await LeadService.deleteLead(id);
      set(state => ({
        leads: state.leads.filter(lead => lead.id !== id),
        selectedLead: state.selectedLead?.id === id ? null : state.selectedLead,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete lead', loading: false });
      throw error;
    }
  },

  convertToClient: async (leadId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await LeadService.convertToClient(leadId);
      // Update the lead status to 'won' in the local state
      set(state => ({
        leads: state.leads.map(lead => 
          lead.id === leadId ? { ...lead, status: 'won' as Lead['status'] } : lead
        ),
        loading: false
      }));
      return result;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to convert lead', loading: false });
      throw error;
    }
  },

  setFilters: (filters: Partial<LeadFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedLead: (lead: Lead | null) => {
    set({ selectedLead: lead });
  },

  fetchStaff: async () => {
    try {
      const staff = await LeadService.getStaff();
      set({ staff });
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  },

  getKanbanColumns: () => {
    const leads = get().leads;
    const columns: KanbanColumn[] = [
      {
        id: 'new',
        title: 'New Leads',
        status: 'new',
        leads: leads.filter(lead => lead.status === 'new'),
        color: '#e3f2fd',
      },
      {
        id: 'contacted',
        title: 'Contacted',
        status: 'contacted',
        leads: leads.filter(lead => lead.status === 'contacted'),
        color: '#f3e5f5',
      },
      {
        id: 'qualified',
        title: 'Qualified',
        status: 'qualified',
        leads: leads.filter(lead => lead.status === 'qualified'),
        color: '#e8f5e8',
      },
      {
        id: 'proposal',
        title: 'Proposal',
        status: 'proposal',
        leads: leads.filter(lead => lead.status === 'proposal'),
        color: '#fff3e0',
      },
      {
        id: 'negotiation',
        title: 'Negotiation',
        status: 'negotiation',
        leads: leads.filter(lead => lead.status === 'negotiation'),
        color: '#fce4ec',
      },
      {
        id: 'won',
        title: 'Won',
        status: 'won',
        leads: leads.filter(lead => lead.status === 'won'),
        color: '#e8f5e8',
      },
      {
        id: 'lost',
        title: 'Lost',
        status: 'lost',
        leads: leads.filter(lead => lead.status === 'lost'),
        color: '#ffebee',
      },
    ];
    return columns;
  },

  moveLeadToStatus: async (leadId: string, newStatus: Lead['status']) => {
    try {
      await get().updateLead(leadId, { status: newStatus });
    } catch (error) {
      throw error;
    }
  },
}));