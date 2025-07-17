import { POSProduct, CartItem, Cart, Sale, SaleFilters, DailySummary } from '../types';
import { Product } from '@/modules/inventory/types';

// Mock products data (in a real app, this would come from the inventory module)
const mockProducts: POSProduct[] = [
  {
    id: '1',
    sku: 'ELEC-001',
    barcode: '1234567890123',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    price: 89.99,
    costPrice: 45.00,
    quantity: 25,
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '2',
    sku: 'CLOTH-001',
    barcode: '2345678901234',
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt in various colors',
    category: 'Clothing',
    price: 19.99,
    costPrice: 8.00,
    quantity: 5,
    imageUrl: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '3',
    sku: 'BOOK-001',
    barcode: '3456789012345',
    name: 'JavaScript Programming Guide',
    description: 'Comprehensive guide to modern JavaScript programming',
    category: 'Books',
    price: 34.99,
    costPrice: 15.00,
    quantity: 0,
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 5,
    discountable: false,
  },
  {
    id: '4',
    sku: 'TOOL-001',
    barcode: '4567890123456',
    name: 'Professional Screwdriver Set',
    description: '12-piece precision screwdriver set with magnetic tips',
    category: 'Tools',
    price: 24.99,
    costPrice: 12.50,
    quantity: 15,
    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '5',
    sku: 'OFFICE-001',
    barcode: '5678901234567',
    name: 'Wireless Computer Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Office Supplies',
    price: 39.99,
    costPrice: 18.00,
    quantity: 3,
    imageUrl: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '6',
    sku: 'PHONE-001',
    barcode: '6789012345678',
    name: 'Smartphone Screen Protector',
    description: 'Tempered glass screen protector for various smartphone models',
    category: 'Phone Accessories',
    price: 12.99,
    costPrice: 3.50,
    quantity: 50,
    imageUrl: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '7',
    sku: 'PHONE-002',
    barcode: '7890123456789',
    name: 'Phone Charging Cable',
    description: 'Fast charging USB cable for smartphones',
    category: 'Phone Accessories',
    price: 9.99,
    costPrice: 2.00,
    quantity: 30,
    imageUrl: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '8',
    sku: 'PHONE-003',
    barcode: '8901234567890',
    name: 'Phone Case',
    description: 'Protective case for various smartphone models',
    category: 'Phone Accessories',
    price: 19.99,
    costPrice: 5.00,
    quantity: 25,
    imageUrl: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '9',
    sku: 'PHONE-004',
    barcode: '9012345678901',
    name: 'Wireless Earbuds',
    description: 'Bluetooth wireless earbuds with charging case',
    category: 'Phone Accessories',
    price: 49.99,
    costPrice: 20.00,
    quantity: 10,
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=300',
    taxRate: 10,
    discountable: true,
  },
  {
    id: '10',
    sku: 'REPAIR-001',
    barcode: '0123456789012',
    name: 'Screen Replacement Service',
    description: 'Smartphone screen replacement service',
    category: 'Repair Services',
    price: 99.99,
    costPrice: 45.00,
    quantity: 999,
    taxRate: 10,
    discountable: false,
  },
  {
    id: '11',
    sku: 'REPAIR-002',
    barcode: '1234567890123',
    name: 'Battery Replacement Service',
    description: 'Smartphone battery replacement service',
    category: 'Repair Services',
    price: 49.99,
    costPrice: 20.00,
    quantity: 999,
    taxRate: 10,
    discountable: false,
  },
  {
    id: '12',
    sku: 'REPAIR-003',
    barcode: '2345678901234',
    name: 'Water Damage Repair',
    description: 'Repair service for water damaged devices',
    category: 'Repair Services',
    price: 149.99,
    costPrice: 75.00,
    quantity: 999,
    taxRate: 10,
    discountable: false,
  },
];

// Mock sales data
const mockSales: Sale[] = [
  {
    id: '1',
    number: 'SALE-2024-001',
    date: '2024-02-15',
    items: [
      {
        productId: '1',
        sku: 'ELEC-001',
        name: 'Wireless Bluetooth Headphones',
        price: 89.99,
        quantity: 1,
        discount: 0,
        discountType: 'percentage',
        tax: 9.00,
        total: 98.99,
      },
      {
        productId: '7',
        sku: 'PHONE-002',
        name: 'Phone Charging Cable',
        price: 9.99,
        quantity: 2,
        discount: 0,
        discountType: 'percentage',
        tax: 2.00,
        total: 21.98,
      },
    ],
    subtotal: 109.97,
    taxTotal: 11.00,
    discountTotal: 0,
    total: 120.97,
    paymentMethod: 'card',
    paymentDetails: {
      card: {
        amount: 120.97,
        reference: 'CARD-123456',
        last4: '4242',
      },
    },
    customerId: '1',
    customerName: 'John Smith',
    status: 'completed',
    createdAt: '2024-02-15T10:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '2',
    number: 'SALE-2024-002',
    date: '2024-02-16',
    items: [
      {
        productId: '10',
        sku: 'REPAIR-001',
        name: 'Screen Replacement Service',
        price: 99.99,
        quantity: 1,
        discount: 0,
        discountType: 'percentage',
        tax: 10.00,
        total: 109.99,
      },
      {
        productId: '6',
        sku: 'PHONE-001',
        name: 'Smartphone Screen Protector',
        price: 12.99,
        quantity: 1,
        discount: 0,
        discountType: 'percentage',
        tax: 1.30,
        total: 14.29,
      },
    ],
    subtotal: 112.98,
    taxTotal: 11.30,
    discountTotal: 0,
    total: 124.28,
    paymentMethod: 'cash',
    paymentDetails: {
      cash: {
        amount: 130.00,
        change: 5.72,
      },
    },
    customerId: '2',
    customerName: 'Emily Davis',
    status: 'completed',
    createdAt: '2024-02-16T14:45:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '3',
    number: 'SALE-2024-003',
    date: '2024-02-16',
    items: [
      {
        productId: '9',
        sku: 'PHONE-004',
        name: 'Wireless Earbuds',
        price: 49.99,
        quantity: 1,
        discount: 5.00,
        discountType: 'fixed',
        tax: 4.50,
        total: 49.49,
      },
      {
        productId: '8',
        sku: 'PHONE-003',
        name: 'Phone Case',
        price: 19.99,
        quantity: 1,
        discount: 0,
        discountType: 'percentage',
        tax: 2.00,
        total: 21.99,
      },
    ],
    subtotal: 69.98,
    taxTotal: 6.50,
    discountTotal: 5.00,
    total: 71.48,
    paymentMethod: 'upi',
    paymentDetails: {
      upi: {
        amount: 71.48,
        reference: 'UPI-987654',
      },
    },
    status: 'completed',
    createdAt: '2024-02-16T16:20:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
  {
    id: '4',
    number: 'SALE-2024-004',
    date: '2024-02-17',
    items: [
      {
        productId: '11',
        sku: 'REPAIR-002',
        name: 'Battery Replacement Service',
        price: 49.99,
        quantity: 1,
        discount: 0,
        discountType: 'percentage',
        tax: 5.00,
        total: 54.99,
      },
    ],
    subtotal: 49.99,
    taxTotal: 5.00,
    discountTotal: 0,
    total: 54.99,
    paymentMethod: 'card',
    paymentDetails: {
      card: {
        amount: 54.99,
        reference: 'CARD-654321',
        last4: '1234',
      },
    },
    customerId: '3',
    customerName: 'Michael Brown',
    status: 'completed',
    createdAt: '2024-02-17T11:15:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '5',
    number: 'SALE-2024-005',
    date: '2024-02-17',
    items: [
      {
        productId: '4',
        sku: 'TOOL-001',
        name: 'Professional Screwdriver Set',
        price: 24.99,
        quantity: 2,
        discount: 5,
        discountType: 'percentage',
        tax: 4.50,
        total: 47.48,
      },
      {
        productId: '7',
        sku: 'PHONE-002',
        name: 'Phone Charging Cable',
        price: 9.99,
        quantity: 3,
        discount: 0,
        discountType: 'percentage',
        tax: 3.00,
        total: 32.97,
      },
    ],
    subtotal: 79.95,
    taxTotal: 7.50,
    discountTotal: 2.50,
    total: 84.95,
    paymentMethod: 'multiple',
    paymentDetails: {
      cash: {
        amount: 50.00,
        change: 0,
      },
      card: {
        amount: 34.95,
        reference: 'CARD-789012',
        last4: '5678',
      },
    },
    status: 'completed',
    createdAt: '2024-02-17T15:30:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
];

let products = [...mockProducts];
let sales = [...mockSales];
let nextSaleId = 6;

export class POSService {
  static async getProducts(search?: string, category?: string): Promise<POSProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredProducts = [...products];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.barcode?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    return filteredProducts;
  }

  static async getProductByBarcode(barcode: string): Promise<POSProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return products.find(product => product.barcode === barcode) || null;
  }

  static async getProductById(id: string): Promise<POSProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return products.find(product => product.id === id) || null;
  }

  static async getProductCategories(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = [...new Set(products.map(product => product.category))];
    return categories.sort();
  }

  static async createSale(cart: Cart, paymentMethod: string, paymentDetails: any): Promise<Sale> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if any products are out of stock
    for (const item of cart.items) {
      const product = products.find(p => p.id === item.productId);
      if (product && product.quantity < item.quantity && product.category !== 'Repair Services') {
        throw new Error(`Product ${product.name} is out of stock. Available: ${product.quantity}`);
      }
    }
    
    // Create sale record
    const newSale: Sale = {
      id: nextSaleId.toString(),
      number: `SALE-2024-${nextSaleId.toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      items: cart.items,
      subtotal: cart.subtotal,
      taxTotal: cart.taxTotal,
      discountTotal: cart.discountTotal,
      total: cart.total,
      paymentMethod: paymentMethod as any,
      paymentDetails,
      customerId: cart.customer?.id,
      customerName: cart.customer?.name,
      notes: cart.notes,
      status: 'completed',
      createdAt: new Date().toISOString(),
      createdBy: '1', // Mock current user ID
      createdByName: 'Current User', // Mock current user name
    };
    
    sales.push(newSale);
    nextSaleId++;
    
    // Update product quantities
    for (const item of cart.items) {
      const productIndex = products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1 && products[productIndex].category !== 'Repair Services') {
        products[productIndex].quantity -= item.quantity;
      }
    }
    
    return newSale;
  }

  static async getSales(filters?: SaleFilters): Promise<Sale[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredSales = [...sales];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredSales = filteredSales.filter(sale =>
          sale.number.toLowerCase().includes(search) ||
          sale.customerName?.toLowerCase().includes(search) ||
          sale.items.some(item => item.name.toLowerCase().includes(search))
        );
      }
      
      if (filters.dateRange.start) {
        filteredSales = filteredSales.filter(sale => 
          sale.date >= filters.dateRange.start!
        );
      }
      
      if (filters.dateRange.end) {
        filteredSales = filteredSales.filter(sale => 
          sale.date <= filters.dateRange.end!
        );
      }
      
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        filteredSales = filteredSales.filter(sale => sale.paymentMethod === filters.paymentMethod);
      }
      
      if (filters.minAmount !== undefined) {
        filteredSales = filteredSales.filter(sale => sale.total >= filters.minAmount!);
      }
      
      if (filters.maxAmount !== undefined) {
        filteredSales = filteredSales.filter(sale => sale.total <= filters.maxAmount!);
      }
    }
    
    return filteredSales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getSaleById(id: string): Promise<Sale | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return sales.find(sale => sale.id === id) || null;
  }

  static async getDailySummary(date?: string): Promise<DailySummary> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const daySales = sales.filter(sale => sale.date === targetDate);
    
    const totalSales = daySales.length;
    const totalAmount = daySales.reduce((sum, sale) => sum + sale.total, 0);
    const averageAmount = totalSales > 0 ? totalAmount / totalSales : 0;
    
    // Payment method breakdown
    const paymentMethods = ['cash', 'card', 'upi', 'bank_transfer', 'check', 'multiple'];
    const paymentMethodBreakdown = paymentMethods.map(method => {
      const methodSales = daySales.filter(sale => sale.paymentMethod === method);
      return {
        method,
        count: methodSales.length,
        amount: methodSales.reduce((sum, sale) => sum + sale.total, 0),
      };
    }).filter(item => item.count > 0);
    
    // Hourly breakdown
    const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => {
      const hourSales = daySales.filter(sale => {
        const saleHour = new Date(sale.createdAt).getHours();
        return saleHour === hour;
      });
      
      return {
        hour,
        count: hourSales.length,
        amount: hourSales.reduce((sum, sale) => sum + sale.total, 0),
      };
    }).filter(item => item.count > 0);
    
    return {
      date: targetDate,
      totalSales,
      totalAmount,
      averageAmount,
      paymentMethodBreakdown,
      hourlyBreakdown,
    };
  }

  static async processBarcode(barcode: string): Promise<POSProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate barcode scanning
    return this.getProductByBarcode(barcode);
  }

  // Helper method to convert inventory products to POS products
  static convertInventoryToPOSProducts(inventoryProducts: Product[]): POSProduct[] {
    return inventoryProducts.map(product => ({
      id: product.id,
      sku: product.sku,
      barcode: product.barcode,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.sellingPrice,
      costPrice: product.costPrice,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
      taxRate: 10, // Default tax rate
      discountable: true,
    }));
  }
}