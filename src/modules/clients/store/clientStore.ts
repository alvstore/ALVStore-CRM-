import { create } from 'zustand';
import { Client, ContactPerson, ClientFile, ClientFilters } from '../types';
import { ClientService } from '../services/clientService';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
  filters: ClientFilters;
  
  // Actions
  fetchClients: () => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  createClient: (clientData: any) => Promise<void>;
  updateClient: (id: string, clientData: any) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ClientFilters>) => void;
  clearError: () => void;
  setSelectedClient: (client: Client | null) => void;
  
  // Contact actions
  addContact: (clientId: string, contactData: any) => Promise<void>;
  updateContact: (clientId: string, contactId: string, contactData: any) => Promise<void>;
  deleteContact: (clientId: string, contactId: string) => Promise<void>;
  
  // File actions
  uploadFile: (clientId: string, file: File) => Promise<void>;
  deleteFile: (clientId: string, fileId: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    tags: [],
    dateRange: {},
  },

  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const clients = await ClientService.getClients(get().filters);
      set({ clients, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch clients', loading: false });
    }
  },

  fetchClientById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const client = await ClientService.getClientById(id);
      set({ selectedClient: client, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch client', loading: false });
    }
  },

  createClient: async (clientData: any) => {
    set({ loading: true, error: null });
    try {
      const newClient = await ClientService.createClient(clientData);
      set(state => ({ 
        clients: [...state.clients, newClient], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create client', loading: false });
      throw error;
    }
  },

  updateClient: async (id: string, clientData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedClient = await ClientService.updateClient(id, clientData);
      set(state => ({
        clients: state.clients.map(client => 
          client.id === id ? updatedClient : client
        ),
        selectedClient: state.selectedClient?.id === id ? updatedClient : state.selectedClient,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update client', loading: false });
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await ClientService.deleteClient(id);
      set(state => ({
        clients: state.clients.filter(client => client.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete client', loading: false });
      throw error;
    }
  },

  setFilters: (filters: Partial<ClientFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedClient: (client: Client | null) => {
    set({ selectedClient: client });
  },

  addContact: async (clientId: string, contactData: any) => {
    try {
      const newContact = await ClientService.addContact(clientId, contactData);
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? { ...client, contacts: [...client.contacts, newContact] }
            : client
        ),
        selectedClient: state.selectedClient?.id === clientId
          ? { ...state.selectedClient, contacts: [...state.selectedClient.contacts, newContact] }
          : state.selectedClient
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add contact' });
      throw error;
    }
  },

  updateContact: async (clientId: string, contactId: string, contactData: any) => {
    try {
      const updatedContact = await ClientService.updateContact(clientId, contactId, contactData);
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? {
                ...client,
                contacts: client.contacts.map(contact =>
                  contact.id === contactId ? updatedContact : contact
                )
              }
            : client
        ),
        selectedClient: state.selectedClient?.id === clientId
          ? {
              ...state.selectedClient,
              contacts: state.selectedClient.contacts.map(contact =>
                contact.id === contactId ? updatedContact : contact
              )
            }
          : state.selectedClient
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update contact' });
      throw error;
    }
  },

  deleteContact: async (clientId: string, contactId: string) => {
    try {
      await ClientService.deleteContact(clientId, contactId);
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? { ...client, contacts: client.contacts.filter(contact => contact.id !== contactId) }
            : client
        ),
        selectedClient: state.selectedClient?.id === clientId
          ? { ...state.selectedClient, contacts: state.selectedClient.contacts.filter(contact => contact.id !== contactId) }
          : state.selectedClient
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete contact' });
      throw error;
    }
  },

  uploadFile: async (clientId: string, file: File) => {
    try {
      const newFile = await ClientService.uploadFile(clientId, file);
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? { ...client, files: [...client.files, newFile] }
            : client
        ),
        selectedClient: state.selectedClient?.id === clientId
          ? { ...state.selectedClient, files: [...state.selectedClient.files, newFile] }
          : state.selectedClient
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to upload file' });
      throw error;
    }
  },

  deleteFile: async (clientId: string, fileId: string) => {
    try {
      await ClientService.deleteFile(clientId, fileId);
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? { ...client, files: client.files.filter(file => file.id !== fileId) }
            : client
        ),
        selectedClient: state.selectedClient?.id === clientId
          ? { ...state.selectedClient, files: state.selectedClient.files.filter(file => file.id !== fileId) }
          : state.selectedClient
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete file' });
      throw error;
    }
  },
}));