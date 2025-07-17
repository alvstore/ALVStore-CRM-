import { create } from 'zustand';
import { Payment, PaymentFilters, Invoice } from '../types';
import { PaymentService } from '../services/paymentService';

interface PaymentState {
  payments: Payment[];
  selectedPayment: Payment | null;
  invoices: Invoice[];
  clients: Array<{ id: string; name: string }>;
  loading: boolean;
  error: string | null;
  filters: PaymentFilters;
  
  // Actions
  fetchPayments: () => Promise<void>;
  fetchPaymentById: (id: string) => Promise<void>;
  createPayment: (paymentData: any) => Promise<void>;
  updatePayment: (id: string, paymentData: any) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  setFilters: (filters: Partial<PaymentFilters>) => void;
  clearError: () => void;
  setSelectedPayment: (payment: Payment | null) => void;
  fetchInvoices: () => Promise<void>;
  fetchClients: () => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  selectedPayment: null,
  invoices: [],
  clients: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    invoiceId: 'all',
    clientId: 'all',
    status: 'all',
    paymentMethod: 'all',
    dateRange: {},
    amountRange: {},
  },

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const payments = await PaymentService.getPayments(get().filters);
      set({ payments, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payments', loading: false });
    }
  },

  fetchPaymentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const payment = await PaymentService.getPaymentById(id);
      set({ selectedPayment: payment, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payment', loading: false });
    }
  },

  createPayment: async (paymentData: any) => {
    set({ loading: true, error: null });
    try {
      const newPayment = await PaymentService.createPayment({
        ...paymentData,
        createdBy: '1', // Mock current user ID
      });
      set(state => ({ 
        payments: [newPayment, ...state.payments], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create payment', loading: false });
      throw error;
    }
  },

  updatePayment: async (id: string, paymentData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedPayment = await PaymentService.updatePayment(id, paymentData);
      set(state => ({
        payments: state.payments.map(payment => 
          payment.id === id ? updatedPayment : payment
        ),
        selectedPayment: state.selectedPayment?.id === id ? updatedPayment : state.selectedPayment,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update payment', loading: false });
      throw error;
    }
  },

  deletePayment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await PaymentService.deletePayment(id);
      set(state => ({
        payments: state.payments.filter(payment => payment.id !== id),
        selectedPayment: state.selectedPayment?.id === id ? null : state.selectedPayment,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete payment', loading: false });
      throw error;
    }
  },

  setFilters: (filters: Partial<PaymentFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedPayment: (payment: Payment | null) => {
    set({ selectedPayment: payment });
  },

  fetchInvoices: async () => {
    try {
      const invoices = await PaymentService.getInvoices();
      set({ invoices });
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  },

  fetchClients: async () => {
    try {
      const clients = await PaymentService.getClients();
      set({ clients });
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  },
}));