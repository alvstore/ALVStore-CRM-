import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { POSState, POSProductType, POSOrderType, Customer } from '@/types/apps/posTypes'

const initialState: POSState = {
  cart: {
    items: [],
    customer: null,
    discount: 0,
    tax: 0,
    subtotal: 0,
    total: 0
  },
  recentOrders: [],
  selectedOrder: null,
  payment: {
    method: 'cash',
    amountTendered: 0,
    changeDue: 0,
    status: 'idle'
  }
}

export const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    // Cart Actions
    addToCart: (state, action: PayloadAction<{ product: POSProductType; quantity: number }>) => {
      const { product, quantity } = action.payload
      const existingItem = state.cart.items.find(item => item.product.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.cart.items.push({
          product,
          quantity,
          price: parseFloat(product.price.toString()),
          discount: 0,
          tax: 0,
          total: parseFloat(product.price.toString()) * quantity
        })
      }
      
      // Recalculate totals
      state.cart.subtotal = state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      state.cart.total = state.cart.subtotal + state.cart.tax - state.cart.discount
    },
    
    updateCartItem: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload
      const item = state.cart.items.find(item => item.product.id === productId)
      
      if (item) {
        item.quantity = quantity
        item.total = item.price * quantity
        
        // Recalculate totals
        state.cart.subtotal = state.cart.items.reduce((sum, item) => sum + item.total, 0)
        state.cart.total = state.cart.subtotal + state.cart.tax - state.cart.discount
      }
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart.items = state.cart.items.filter(item => item.product.id !== action.payload)
      
      // Recalculate totals
      state.cart.subtotal = state.cart.items.reduce((sum, item) => sum + item.total, 0)
      state.cart.total = state.cart.subtotal + state.cart.tax - state.cart.discount
    },
    
    clearCart: (state) => {
      state.cart = {
        items: [],
        customer: null,
        discount: 0,
        tax: 0,
        subtotal: 0,
        total: 0
      }
    },
    
    // Customer Actions
    setCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.cart.customer = action.payload
    },
    
    // Order Actions
    createOrder: (state) => {
      // This would be handled by an async thunk in a real app
      const newOrder: POSOrderType = {
        id: `ORD-${Date.now()}`,
        orderNumber: `ORD-${Date.now()}`,
        customer: state.cart.customer || undefined,
        customerId: state.cart.customer?.id,
        items: state.cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          tax: item.tax,
          total: item.total
        })),
        subtotal: state.cart.subtotal,
        tax: state.cart.tax,
        discount: state.cart.discount,
        total: state.cart.total,
        paymentMethod: state.payment.method,
        status: 'completed',
        createdAt: new Date().toISOString(),
        createdBy: 1, // Replace with actual user ID
        updatedAt: new Date().toISOString()
      }
      
      state.recentOrders.unshift(newOrder)
      state.selectedOrder = newOrder
    },
    
    // Payment Actions
    setPaymentMethod: (state, action: PayloadAction<'cash' | 'card' | 'upi' | 'other'>) => {
      state.payment.method = action.payload
    },
    
    setAmountTendered: (state, action: PayloadAction<number>) => {
      state.payment.amountTendered = action.payload
      state.payment.changeDue = Math.max(0, action.payload - state.cart.total)
    },
    
    processPayment: (state) => {
      state.payment.status = 'processing'
      // In a real app, this would be an async operation
      state.payment.status = 'completed'
    },
    
    resetPayment: (state) => {
      state.payment = {
        method: 'cash',
        amountTendered: 0,
        changeDue: 0,
        status: 'idle'
      }
    }
  }
})

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  setCustomer,
  createOrder,
  setPaymentMethod,
  setAmountTendered,
  processPayment,
  resetPayment
} = posSlice.actions

export default posSlice.reducer
