import { ProductType as EcommerceProductType } from './ecommerceTypes'
import { Customer } from './ecommerceTypes'

export interface POSProductType extends EcommerceProductType {
  barcode?: string
  costPrice: number
  taxRate: number
  isService?: boolean
  trackInventory: boolean
  lowStockThreshold?: number
}

export interface POSOrderItem {
  productId: number
  quantity: number
  price: number
  discount: number
  tax: number
  total: number
  notes?: string
}

export interface POSOrderType {
  id: string
  orderNumber: string
  customerId?: number
  customer?: Customer
  items: POSOrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'cash' | 'card' | 'upi' | 'other'
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: number
  updatedBy?: number
}

export interface POSPayment {
  id: string
  orderId: string
  amount: number
  method: 'cash' | 'card' | 'upi' | 'other'
  transactionId?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  notes?: string
  createdAt: string
  createdBy: number
}

export interface POSState {
  cart: {
    items: Array<{
      product: POSProductType
      quantity: number
      price: number
      discount: number
      tax: number
      total: number
    }>
    customer: Customer | null
    discount: number
    tax: number
    subtotal: number
    total: number
  }
  recentOrders: POSOrderType[]
  selectedOrder: POSOrderType | null
  payment: {
    method: 'cash' | 'card' | 'upi' | 'other'
    amountTendered: number
    changeDue: number
    status: 'idle' | 'processing' | 'completed' | 'failed'
  }
}
