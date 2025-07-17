import { create } from 'zustand';
import { 
  POSProduct, 
  CartItem, 
  Cart, 
  Sale, 
  SaleFilters,
  DailySummary
} from '../types';
import { POSService } from '../services/posService';

interface POSState {
  products: POSProduct[];
  filteredProducts: POSProduct[];
  categories: string[];
  cart: Cart;
  sales: Sale[];
  selectedSale: Sale | null;
  dailySummary: DailySummary | null;
  loading: boolean;
  error: string | null;
  filters: SaleFilters;
  searchTerm: string;
  selectedCategory: string;
  
  // Product actions
  fetchProducts: () => Promise<void>;
  searchProducts: (term: string, category?: string) => Promise<void>;
  fetchProductByBarcode: (barcode: string) => Promise<POSProduct | null>;
  fetchCategories: () => Promise<void>;
  
  // Cart actions
  addToCart: (product: POSProduct, quantity?: number) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  updateCartItemDiscount: (productId: string, discount: number, discountType: 'percentage' | 'fixed') => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCustomer: (customer: { id: string; name: string; email: string; phone: string } | undefined) => void;
  setNotes: (notes: string) => void;
  
  // Sale actions
  createSale: (paymentMethod: string, paymentDetails: any) => Promise<Sale>;
  fetchSales: () => Promise<void>;
  fetchSaleById: (id: string) => Promise<void>;
  fetchDailySummary: (date?: string) => Promise<void>;
  
  // Filter actions
  setFilters: (filters: Partial<SaleFilters>) => void;
  clearError: () => void;
  
  // Barcode actions
  processBarcode: (barcode: string) => Promise<void>;
}

export const usePOSStore = create<POSState>((set, get) => ({
  products: [],
  filteredProducts: [],
  categories: [],
  cart: {
    items: [],
    subtotal: 0,
    taxTotal: 0,
    discountTotal: 0,
    total: 0,
  },
  sales: [],
  selectedSale: null,
  dailySummary: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    dateRange: {},
  },
  searchTerm: '',
  selectedCategory: 'all',

  // Product actions
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await POSService.getProducts();
      set({ 
        products, 
        filteredProducts: products,
        loading: false 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch products', loading: false });
    }
  },

  searchProducts: async (term: string, category?: string) => {
    set({ loading: true, error: null, searchTerm: term, selectedCategory: category || 'all' });
    try {
      const products = await POSService.getProducts(term, category);
      set({ filteredProducts: products, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to search products', loading: false });
    }
  },

  fetchProductByBarcode: async (barcode: string) => {
    try {
      return await POSService.getProductByBarcode(barcode);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch product by barcode' });
      return null;
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await POSService.getProductCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  // Cart actions
  addToCart: (product: POSProduct, quantity = 1) => {
    const { cart } = get();
    
    // Check if product is already in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if already in cart
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      get().updateCartItemQuantity(product.id, newQuantity);
      return;
    }
    
    // Calculate tax
    const tax = (product.price * quantity * product.taxRate) / 100;
    
    // Add new item to cart
    const newItem: CartItem = {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity,
      discount: 0,
      discountType: 'percentage',
      tax,
      total: (product.price * quantity) + tax,
    };
    
    const newItems = [...cart.items, newItem];
    
    // Recalculate cart totals
    const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = newItems.reduce((sum, item) => sum + item.tax, 0);
    const discountTotal = newItems.reduce((sum, item) => {
      if (item.discountType === 'percentage') {
        return sum + ((item.price * item.quantity) * (item.discount / 100));
      } else {
        return sum + item.discount;
      }
    }, 0);
    const total = subtotal + taxTotal - discountTotal;
    
    set({
      cart: {
        ...cart,
        items: newItems,
        subtotal,
        taxTotal,
        discountTotal,
        total,
      }
    });
  },

  updateCartItemQuantity: (productId: string, quantity: number) => {
    const { cart, products } = get();
    
    // Find the product to get tax rate
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return;
    
    // Update quantity and recalculate
    const updatedItems = [...cart.items];
    
    // Calculate tax
    const tax = (product.price * quantity * product.taxRate) / 100;
    
    // Calculate discount
    let discount = 0;
    if (updatedItems[itemIndex].discountType === 'percentage') {
      discount = (product.price * quantity) * (updatedItems[itemIndex].discount / 100);
    } else {
      discount = updatedItems[itemIndex].discount;
    }
    
    // Update the item
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity,
      tax,
      total: (product.price * quantity) + tax - discount,
    };
    
    // Recalculate cart totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = updatedItems.reduce((sum, item) => sum + item.tax, 0);
    const discountTotal = updatedItems.reduce((sum, item) => {
      if (item.discountType === 'percentage') {
        return sum + ((item.price * item.quantity) * (item.discount / 100));
      } else {
        return sum + item.discount;
      }
    }, 0);
    const total = subtotal + taxTotal - discountTotal;
    
    set({
      cart: {
        ...cart,
        items: updatedItems,
        subtotal,
        taxTotal,
        discountTotal,
        total,
      }
    });
  },

  updateCartItemDiscount: (productId: string, discount: number, discountType: 'percentage' | 'fixed') => {
    const { cart } = get();
    
    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return;
    
    // Update discount and recalculate
    const updatedItems = [...cart.items];
    const item = updatedItems[itemIndex];
    
    // Calculate discount amount
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (item.price * item.quantity) * (discount / 100);
    } else {
      discountAmount = discount;
    }
    
    // Update the item
    updatedItems[itemIndex] = {
      ...item,
      discount,
      discountType,
      total: (item.price * item.quantity) + item.tax - discountAmount,
    };
    
    // Recalculate cart totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = updatedItems.reduce((sum, item) => sum + item.tax, 0);
    const discountTotal = updatedItems.reduce((sum, item) => {
      if (item.discountType === 'percentage') {
        return sum + ((item.price * item.quantity) * (item.discount / 100));
      } else {
        return sum + item.discount;
      }
    }, 0);
    const total = subtotal + taxTotal - discountTotal;
    
    set({
      cart: {
        ...cart,
        items: updatedItems,
        subtotal,
        taxTotal,
        discountTotal,
        total,
      }
    });
  },

  removeFromCart: (productId: string) => {
    const { cart } = get();
    
    // Remove item from cart
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    
    // Recalculate cart totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = updatedItems.reduce((sum, item) => sum + item.tax, 0);
    const discountTotal = updatedItems.reduce((sum, item) => {
      if (item.discountType === 'percentage') {
        return sum + ((item.price * item.quantity) * (item.discount / 100));
      } else {
        return sum + item.discount;
      }
    }, 0);
    const total = subtotal + taxTotal - discountTotal;
    
    set({
      cart: {
        ...cart,
        items: updatedItems,
        subtotal,
        taxTotal,
        discountTotal,
        total,
      }
    });
  },

  clearCart: () => {
    set({
      cart: {
        items: [],
        subtotal: 0,
        taxTotal: 0,
        discountTotal: 0,
        total: 0,
        customer: undefined,
        notes: undefined,
      }
    });
  },

  setCustomer: (customer) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        customer,
      }
    });
  },

  setNotes: (notes) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        notes,
      }
    });
  },

  // Sale actions
  createSale: async (paymentMethod, paymentDetails) => {
    set({ loading: true, error: null });
    try {
      const { cart } = get();
      
      if (cart.items.length === 0) {
        throw new Error('Cart is empty');
      }
      
      const sale = await POSService.createSale(cart, paymentMethod, paymentDetails);
      
      // Clear cart after successful sale
      get().clearCart();
      
      set(state => ({ 
        sales: [sale, ...state.sales], 
        loading: false 
      }));
      
      return sale;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create sale', loading: false });
      throw error;
    }
  },

  fetchSales: async () => {
    set({ loading: true, error: null });
    try {
      const sales = await POSService.getSales(get().filters);
      set({ sales, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch sales', loading: false });
    }
  },

  fetchSaleById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const sale = await POSService.getSaleById(id);
      set({ selectedSale: sale, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch sale', loading: false });
    }
  },

  fetchDailySummary: async (date?: string) => {
    set({ loading: true, error: null });
    try {
      const summary = await POSService.getDailySummary(date);
      set({ dailySummary: summary, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch daily summary', loading: false });
    }
  },

  // Filter actions
  setFilters: (filters: Partial<SaleFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  // Barcode actions
  processBarcode: async (barcode: string) => {
    set({ loading: true, error: null });
    try {
      const product = await POSService.processBarcode(barcode);
      
      if (!product) {
        throw new Error(`No product found with barcode: ${barcode}`);
      }
      
      // Add product to cart
      get().addToCart(product, 1);
      
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to process barcode', loading: false });
      throw error;
    }
  },
}));