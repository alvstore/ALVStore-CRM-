import { create } from 'zustand';
import { Product, ProductFilters, StockMovement, ProductCategory, LowStockAlert } from '../types';
import { InventoryService } from '../services/inventoryService';

interface InventoryState {
  products: Product[];
  selectedProduct: Product | null;
  stockMovements: StockMovement[];
  categories: ProductCategory[];
  lowStockAlerts: LowStockAlert[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (productData: any) => Promise<void>;
  updateProduct: (id: string, productData: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  createStockMovement: (movementData: any) => Promise<void>;
  fetchStockMovements: (productId?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchLowStockAlerts: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;
  setSelectedProduct: (product: Product | null) => void;
  generateBarcode: () => Promise<string>;
  generateSku: (category: string) => Promise<string>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [],
  selectedProduct: null,
  stockMovements: [],
  categories: [],
  lowStockAlerts: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    status: 'all',
    lowStock: false,
    tags: [],
    priceRange: {},
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await InventoryService.getProducts(get().filters);
      set({ products, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch products', loading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const product = await InventoryService.getProductById(id);
      set({ selectedProduct: product, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch product', loading: false });
    }
  },

  createProduct: async (productData: any) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await InventoryService.createProduct({
        ...productData,
        createdBy: '1', // Mock current user ID
      });
      set(state => ({ 
        products: [newProduct, ...state.products], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create product', loading: false });
      throw error;
    }
  },

  updateProduct: async (id: string, productData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await InventoryService.updateProduct(id, productData);
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? updatedProduct : product
        ),
        selectedProduct: state.selectedProduct?.id === id ? updatedProduct : state.selectedProduct,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update product', loading: false });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await InventoryService.deleteProduct(id);
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete product', loading: false });
      throw error;
    }
  },

  createStockMovement: async (movementData: any) => {
    try {
      const newMovement = await InventoryService.createStockMovement({
        ...movementData,
        createdBy: '1', // Mock current user ID
      });
      
      set(state => ({
        stockMovements: [newMovement, ...state.stockMovements],
        // Update the product quantity in the products list
        products: state.products.map(product => 
          product.id === movementData.productId 
            ? { ...product, quantity: newMovement.newQuantity, lastStockUpdate: newMovement.createdAt }
            : product
        ),
        selectedProduct: state.selectedProduct?.id === movementData.productId
          ? { ...state.selectedProduct, quantity: newMovement.newQuantity, lastStockUpdate: newMovement.createdAt }
          : state.selectedProduct,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create stock movement' });
      throw error;
    }
  },

  fetchStockMovements: async (productId?: string) => {
    try {
      const movements = await InventoryService.getStockMovements(productId);
      set({ stockMovements: movements });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch stock movements' });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await InventoryService.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchLowStockAlerts: async () => {
    try {
      const alerts = await InventoryService.getLowStockAlerts();
      set({ lowStockAlerts: alerts });
    } catch (error) {
      console.error('Failed to fetch low stock alerts:', error);
    }
  },

  setFilters: (filters: Partial<ProductFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  generateBarcode: async () => {
    return await InventoryService.generateBarcode();
  },

  generateSku: async (category: string) => {
    return await InventoryService.generateSku(category);
  },
}));