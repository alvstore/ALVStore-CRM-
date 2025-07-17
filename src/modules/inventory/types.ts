export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  unit: string; // piece, kg, liter, etc.
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  location?: string;
  supplier?: string;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  lastStockUpdate?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference?: string;
  notes?: string;
  date: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface ProductFormData {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  location?: string;
  supplier?: string;
  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
}

export interface StockMovementFormData {
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  notes?: string;
  date: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  lowStock: boolean;
  tags: string[];
  priceRange: {
    min?: number;
    max?: number;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface LowStockAlert {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  currentQuantity: number;
  minStockLevel: number;
  category: string;
  severity: 'low' | 'critical' | 'out_of_stock';
  createdAt: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoryBreakdown: { category: string; count: number; value: number }[];
  recentMovements: StockMovement[];
}