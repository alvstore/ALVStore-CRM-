import { Product, ProductFilters, StockMovement, ProductCategory, LowStockAlert, InventoryStats } from '../types';

// Mock product categories
const mockCategories: ProductCategory[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and components', color: '#2196f3' },
  { id: '2', name: 'Clothing', description: 'Apparel and accessories', color: '#4caf50' },
  { id: '3', name: 'Books', description: 'Books and publications', color: '#ff9800' },
  { id: '4', name: 'Home & Garden', description: 'Home improvement and garden supplies', color: '#9c27b0' },
  { id: '5', name: 'Sports', description: 'Sports equipment and accessories', color: '#f44336' },
  { id: '6', name: 'Tools', description: 'Hand tools and equipment', color: '#795548' },
  { id: '7', name: 'Office Supplies', description: 'Office equipment and stationery', color: '#607d8b' },
  { id: '8', name: 'Health & Beauty', description: 'Health and beauty products', color: '#e91e63' },
];

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'ELEC-001',
    barcode: '1234567890123',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    brand: 'TechBrand',
    unit: 'piece',
    costPrice: 45.00,
    sellingPrice: 89.99,
    quantity: 25,
    minStockLevel: 10,
    maxStockLevel: 100,
    location: 'A1-B2',
    supplier: 'Electronics Supplier Inc.',
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    tags: ['wireless', 'bluetooth', 'audio'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    lastStockUpdate: '2024-01-25T14:30:00Z',
  },
  {
    id: '2',
    sku: 'CLOTH-001',
    barcode: '2345678901234',
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt in various colors',
    category: 'Clothing',
    brand: 'FashionCo',
    unit: 'piece',
    costPrice: 8.00,
    sellingPrice: 19.99,
    quantity: 5,
    minStockLevel: 20,
    maxStockLevel: 200,
    location: 'B2-C3',
    supplier: 'Textile Suppliers Ltd.',
    imageUrl: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    tags: ['cotton', 'casual', 'clothing'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-28T11:15:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    lastStockUpdate: '2024-01-28T11:15:00Z',
  },
  {
    id: '3',
    sku: 'BOOK-001',
    barcode: '3456789012345',
    name: 'JavaScript Programming Guide',
    description: 'Comprehensive guide to modern JavaScript programming',
    category: 'Books',
    brand: 'TechBooks',
    unit: 'piece',
    costPrice: 15.00,
    sellingPrice: 34.99,
    quantity: 0,
    minStockLevel: 5,
    maxStockLevel: 50,
    location: 'C1-A1',
    supplier: 'Book Distributors',
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    tags: ['programming', 'javascript', 'education'],
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-30T16:45:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    lastStockUpdate: '2024-01-30T16:45:00Z',
  },
  {
    id: '4',
    sku: 'TOOL-001',
    barcode: '4567890123456',
    name: 'Professional Screwdriver Set',
    description: '12-piece precision screwdriver set with magnetic tips',
    category: 'Tools',
    brand: 'ToolMaster',
    unit: 'set',
    costPrice: 12.50,
    sellingPrice: 24.99,
    quantity: 15,
    minStockLevel: 8,
    maxStockLevel: 40,
    location: 'D1-B1',
    supplier: 'Hardware Supplies Co.',
    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    tags: ['tools', 'screwdriver', 'precision'],
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-29T09:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
    lastStockUpdate: '2024-01-29T09:30:00Z',
  },
  {
    id: '5',
    sku: 'OFFICE-001',
    barcode: '5678901234567',
    name: 'Wireless Computer Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Office Supplies',
    brand: 'OfficeTech',
    unit: 'piece',
    costPrice: 18.00,
    sellingPrice: 39.99,
    quantity: 3,
    minStockLevel: 15,
    maxStockLevel: 75,
    location: 'A2-C1',
    supplier: 'Office Equipment Ltd.',
    imageUrl: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    tags: ['wireless', 'mouse', 'computer'],
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-01-31T10:20:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
    lastStockUpdate: '2024-01-31T10:20:00Z',
  },
];

// Mock stock movements
const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Wireless Bluetooth Headphones',
    productSku: 'ELEC-001',
    type: 'in',
    quantity: 50,
    previousQuantity: 0,
    newQuantity: 50,
    reason: 'Initial stock',
    reference: 'PO-2024-001',
    notes: 'First delivery from supplier',
    date: '2024-01-15',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
  {
    id: '2',
    productId: '1',
    productName: 'Wireless Bluetooth Headphones',
    productSku: 'ELEC-001',
    type: 'out',
    quantity: 25,
    previousQuantity: 50,
    newQuantity: 25,
    reason: 'Sales',
    reference: 'INV-2024-001',
    notes: 'Sold to customer',
    date: '2024-01-25',
    createdAt: '2024-01-25T14:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '3',
    productId: '2',
    productName: 'Cotton T-Shirt',
    productSku: 'CLOTH-001',
    type: 'in',
    quantity: 100,
    previousQuantity: 0,
    newQuantity: 100,
    reason: 'Purchase order',
    reference: 'PO-2024-002',
    notes: 'Bulk order for season',
    date: '2024-01-10',
    createdAt: '2024-01-10T09:00:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '4',
    productId: '2',
    productName: 'Cotton T-Shirt',
    productSku: 'CLOTH-001',
    type: 'out',
    quantity: 95,
    previousQuantity: 100,
    newQuantity: 5,
    reason: 'Sales',
    reference: 'Multiple invoices',
    notes: 'High demand item',
    date: '2024-01-28',
    createdAt: '2024-01-28T11:15:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '5',
    productId: '3',
    productName: 'JavaScript Programming Guide',
    productSku: 'BOOK-001',
    type: 'out',
    quantity: 15,
    previousQuantity: 15,
    newQuantity: 0,
    reason: 'Sales',
    reference: 'INV-2024-015',
    notes: 'Sold all remaining stock',
    date: '2024-01-30',
    createdAt: '2024-01-30T16:45:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
];

let products = [...mockProducts];
let stockMovements = [...mockStockMovements];
let nextProductId = 6;
let nextMovementId = 6;

export class InventoryService {
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredProducts = [...products];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(search) ||
          product.sku.toLowerCase().includes(search) ||
          product.barcode?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search)
        );
      }
      
      if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category);
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.status === filters.status);
      }
      
      if (filters.lowStock) {
        filteredProducts = filteredProducts.filter(product => product.quantity <= product.minStockLevel);
      }
      
      if (filters.tags.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          filters.tags.some(tag => product.tags.includes(tag))
        );
      }
      
      if (filters.priceRange.min !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.sellingPrice >= filters.priceRange.min!);
      }
      
      if (filters.priceRange.max !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.sellingPrice <= filters.priceRange.max!);
      }
    }
    
    return filteredProducts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return products.find(product => product.id === id) || null;
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdByName' | 'lastStockUpdate'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for duplicate SKU
    if (products.some(p => p.sku === productData.sku)) {
      throw new Error('SKU already exists');
    }
    
    const newProduct: Product = {
      ...productData,
      id: nextProductId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByName: 'Current User',
      lastStockUpdate: new Date().toISOString(),
    };
    
    products.push(newProduct);
    nextProductId++;
    
    // Create initial stock movement if quantity > 0
    if (productData.quantity > 0) {
      const stockMovement: StockMovement = {
        id: nextMovementId.toString(),
        productId: newProduct.id,
        productName: newProduct.name,
        productSku: newProduct.sku,
        type: 'in',
        quantity: productData.quantity,
        previousQuantity: 0,
        newQuantity: productData.quantity,
        reason: 'Initial stock',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        createdBy: productData.createdBy,
        createdByName: 'Current User',
      };
      stockMovements.push(stockMovement);
      nextMovementId++;
    }
    
    return newProduct;
  }

  static async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    // Check for duplicate SKU if SKU is being changed
    if (productData.sku && productData.sku !== products[index].sku) {
      if (products.some(p => p.sku === productData.sku && p.id !== id)) {
        throw new Error('SKU already exists');
      }
    }
    
    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    
    return products[index];
  }

  static async deleteProduct(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    products.splice(index, 1);
    
    // Remove related stock movements
    stockMovements = stockMovements.filter(movement => movement.productId !== id);
  }

  static async createStockMovement(movementData: Omit<StockMovement, 'id' | 'productName' | 'productSku' | 'previousQuantity' | 'newQuantity' | 'createdAt' | 'createdByName'>): Promise<StockMovement> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const product = products.find(p => p.id === movementData.productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const previousQuantity = product.quantity;
    let newQuantity: number;
    
    switch (movementData.type) {
      case 'in':
        newQuantity = previousQuantity + movementData.quantity;
        break;
      case 'out':
        newQuantity = previousQuantity - movementData.quantity;
        if (newQuantity < 0) {
          throw new Error('Insufficient stock');
        }
        break;
      case 'adjustment':
        newQuantity = movementData.quantity;
        break;
      default:
        throw new Error('Invalid movement type');
    }
    
    const newMovement: StockMovement = {
      ...movementData,
      id: nextMovementId.toString(),
      productName: product.name,
      productSku: product.sku,
      previousQuantity,
      newQuantity,
      createdAt: new Date().toISOString(),
      createdByName: 'Current User',
    };
    
    // Update product quantity
    const productIndex = products.findIndex(p => p.id === movementData.productId);
    products[productIndex].quantity = newQuantity;
    products[productIndex].lastStockUpdate = new Date().toISOString();
    products[productIndex].updatedAt = new Date().toISOString();
    
    stockMovements.push(newMovement);
    nextMovementId++;
    
    return newMovement;
  }

  static async getStockMovements(productId?: string): Promise<StockMovement[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let movements = [...stockMovements];
    
    if (productId) {
      movements = movements.filter(movement => movement.productId === productId);
    }
    
    return movements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getCategories(): Promise<ProductCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories;
  }

  static async getLowStockAlerts(): Promise<LowStockAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const alerts: LowStockAlert[] = [];
    
    products.forEach(product => {
      if (product.quantity <= product.minStockLevel) {
        let severity: 'low' | 'critical' | 'out_of_stock';
        
        if (product.quantity === 0) {
          severity = 'out_of_stock';
        } else if (product.quantity <= product.minStockLevel * 0.5) {
          severity = 'critical';
        } else {
          severity = 'low';
        }
        
        alerts.push({
          id: `alert_${product.id}`,
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          currentQuantity: product.quantity,
          minStockLevel: product.minStockLevel,
          category: product.category,
          severity,
          createdAt: new Date().toISOString(),
        });
      }
    });
    
    return alerts.sort((a, b) => {
      const severityOrder = { out_of_stock: 3, critical: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  static async getInventoryStats(): Promise<InventoryStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
    const lowStockItems = products.filter(p => p.quantity <= p.minStockLevel && p.quantity > 0).length;
    const outOfStockItems = products.filter(p => p.quantity === 0).length;
    
    const categoryBreakdown = mockCategories.map(category => {
      const categoryProducts = products.filter(p => p.category === category.name);
      return {
        category: category.name,
        count: categoryProducts.length,
        value: categoryProducts.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0),
      };
    }).filter(item => item.count > 0);
    
    const recentMovements = stockMovements
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
    
    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categoryBreakdown,
      recentMovements,
    };
  }

  static async generateBarcode(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate a random 13-digit barcode
    let barcode = '';
    for (let i = 0; i < 13; i++) {
      barcode += Math.floor(Math.random() * 10).toString();
    }
    
    // Check if barcode already exists
    while (products.some(p => p.barcode === barcode)) {
      barcode = '';
      for (let i = 0; i < 13; i++) {
        barcode += Math.floor(Math.random() * 10).toString();
      }
    }
    
    return barcode;
  }

  static async generateSku(category: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categoryPrefix = category.toUpperCase().substring(0, 4);
    const existingSkus = products
      .filter(p => p.sku.startsWith(categoryPrefix))
      .map(p => p.sku);
    
    let counter = 1;
    let sku = `${categoryPrefix}-${counter.toString().padStart(3, '0')}`;
    
    while (existingSkus.includes(sku)) {
      counter++;
      sku = `${categoryPrefix}-${counter.toString().padStart(3, '0')}`;
    }
    
    return sku;
  }
}