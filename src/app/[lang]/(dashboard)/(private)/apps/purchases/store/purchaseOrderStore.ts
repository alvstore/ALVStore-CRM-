import { create } from 'zustand';
import { PurchaseOrder, PurchaseOrderFilters, Supplier } from '../types';
import { PurchaseOrderService } from '../services/purchaseOrderService';

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[];
  selectedPurchaseOrder: PurchaseOrder | null;
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  filters: PurchaseOrderFilters;
  
  // Actions
  fetchPurchaseOrders: () => Promise<void>;
  fetchPurchaseOrderById: (id: string) => Promise<void>;
  createPurchaseOrder: (poData: any) => Promise<void>;
  updatePurchaseOrder: (id: string, poData: any) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
  receiveStock: (data: any) => Promise<void>;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => Promise<void>;
  setFilters: (filters: Partial<PurchaseOrderFilters>) => void;
  clearError: () => void;
  setSelectedPurchaseOrder: (po: PurchaseOrder | null) => void;
  fetchSuppliers: () => Promise<void>;
}

export const usePurchaseOrderStore = create<PurchaseOrderState>((set, get) => ({
  purchaseOrders: [],
  selectedPurchaseOrder: null,
  suppliers: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    supplierId: 'all',
    dateRange: {},
  },

  fetchPurchaseOrders: async () => {
    set({ loading: true, error: null });
    try {
      const purchaseOrders = await PurchaseOrderService.getPurchaseOrders(get().filters);
      set({ purchaseOrders, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch purchase orders', loading: false });
    }
  },

  fetchPurchaseOrderById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const purchaseOrder = await PurchaseOrderService.getPurchaseOrderById(id);
      set({ selectedPurchaseOrder: purchaseOrder, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch purchase order', loading: false });
    }
  },

  createPurchaseOrder: async (poData: any) => {
    set({ loading: true, error: null });
    try {
      const newPO = await PurchaseOrderService.createPurchaseOrder(poData);
      set(state => ({ 
        purchaseOrders: [newPO, ...state.purchaseOrders], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create purchase order', loading: false });
      throw error;
    }
  },

  updatePurchaseOrder: async (id: string, poData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedPO = await PurchaseOrderService.updatePurchaseOrder(id, poData);
      set(state => ({
        purchaseOrders: state.purchaseOrders.map(po => 
          po.id === id ? updatedPO : po
        ),
        selectedPurchaseOrder: state.selectedPurchaseOrder?.id === id ? updatedPO : state.selectedPurchaseOrder,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update purchase order', loading: false });
      throw error;
    }
  },

  deletePurchaseOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await PurchaseOrderService.deletePurchaseOrder(id);
      set(state => ({
        purchaseOrders: state.purchaseOrders.filter(po => po.id !== id),
        selectedPurchaseOrder: state.selectedPurchaseOrder?.id === id ? null : state.selectedPurchaseOrder,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete purchase order', loading: false });
      throw error;
    }
  },

  receiveStock: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const updatedPO = await PurchaseOrderService.receiveStock(data);
      set(state => ({
        purchaseOrders: state.purchaseOrders.map(po => 
          po.id === data.purchaseOrderId ? updatedPO : po
        ),
        selectedPurchaseOrder: state.selectedPurchaseOrder?.id === data.purchaseOrderId ? updatedPO : state.selectedPurchaseOrder,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to receive stock', loading: false });
      throw error;
    }
  },

  updatePurchaseOrderStatus: async (id: string, status: PurchaseOrder['status']) => {
    try {
      const updatedPO = await PurchaseOrderService.updatePurchaseOrderStatus(id, status);
      set(state => ({
        purchaseOrders: state.purchaseOrders.map(po => 
          po.id === id ? updatedPO : po
        ),
        selectedPurchaseOrder: state.selectedPurchaseOrder?.id === id ? updatedPO : state.selectedPurchaseOrder,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update purchase order status' });
      throw error;
    }
  },

  setFilters: (filters: Partial<PurchaseOrderFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedPurchaseOrder: (po: PurchaseOrder | null) => {
    set({ selectedPurchaseOrder: po });
  },

  fetchSuppliers: async () => {
    try {
      const suppliers = await PurchaseOrderService.getSuppliers();
      set({ suppliers });
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  },
}));