'use client'

// React Imports
import { useState, useCallback } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

// Third-party Imports
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import type { RootState } from '@/redux-store'

// Component Imports
import dynamic from 'next/dynamic'

// Import the exact types from the components
import type { default as ProductSearchComponent } from '@/views/apps/pos/components/ProductSearch'
import type { default as CartItemsComponent } from '@/views/apps/pos/components/CartItems'

// Define prop types for dynamic components
type ProductSearchProps = React.ComponentProps<typeof ProductSearchComponent>
type CartItem = Parameters<typeof CartItemsComponent>[0]['items'][0]

interface CartItemsProps {
  items: CartItem[]
  onQuantityChange: (productId: number, quantity: number) => void
  onRemoveItem: (productId: number) => void
}

interface Customer {
  id: number
  customer: string
  email: string
  avatar?: string
  phone?: string
}

interface CustomerSelectorProps {
  customers: Customer[]
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer | null) => void
  onAddNewCustomer: () => void
}

type PaymentMethodType = 'cash' | 'card' | 'upi' | 'other'

interface PaymentMethodProps {
  value: PaymentMethodType
  onChange: (method: PaymentMethodType) => void
  className?: string
}

// Dynamic imports to prevent SSR issues with MUI components
const ProductSearch = dynamic<ProductSearchProps>(
  () => import('../../../../../../../views/apps/pos/components/ProductSearch'), 
  { ssr: false }
)

const CartItems = dynamic<CartItemsProps>(
  () => import('../../../../../../../views/apps/pos/components/CartItems'), 
  { ssr: false }
)

const CustomerSelector = dynamic<CustomerSelectorProps>(
  () => import('../../../../../../../views/apps/pos/components/CustomerSelector'), 
  { ssr: false }
)

const PaymentMethod = dynamic<PaymentMethodProps>(
  () => import('../../../../../../../views/apps/pos/components/PaymentMethod'), 
  { ssr: false }
)

// Mock Data
const customers: Customer[] = [
  { id: 1, customer: 'John Doe', email: 'john@example.com', phone: '+1 555-1234', avatar: '/images/avatars/1.png' },
  { id: 2, customer: 'Jane Smith', email: 'jane@example.com', phone: '+44 555-5678', avatar: '/images/avatars/2.png' },
  { id: 3, customer: 'Bob Johnson', email: 'bob@example.com', phone: '+1 555-9012', avatar: '/images/avatars/3.png' },
]

const PosCheckout = () => {
  // Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  
  // States
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash')
  const [amountTendered, setAmountTendered] = useState('')
  const [discount, setDiscount] = useState('')
  
  // Memoized selectors
  const selectCartState = (state: RootState) => state.pos.cart
  
  const selectCartItems = createSelector(
    [selectCartState],
    (cart) => cart.items || []
  )
  
  const selectCartSubtotal = createSelector(
    [selectCartState],
    (cart) => cart.subtotal || 0
  )
  
  const selectCartTax = createSelector(
    [selectCartState],
    (cart) => cart.tax || 0
  )
  
  const selectCartTotal = createSelector(
    [selectCartState],
    (cart) => cart.total || 0
  )
  
  // Get cart data using memoized selectors
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const tax = useSelector(selectCartTax)
  const total = useSelector(selectCartTotal)
  
  // Calculate change
  const changeDue = parseFloat(amountTendered) - total || 0
  
  // Handle complete sale
  const handleCompleteSale = useCallback(() => {
    // In a real app, this would dispatch an action to process the payment
    // and create the order in the database
    console.log('Processing payment...')
    
    // For demo purposes, just navigate to the receipt page
    router.push('/apps/pos/receipt/123')
  }, [router])
  
  // Handle discount application
  const applyDiscount = useCallback(() => {
    // In a real app, this would validate and apply the discount
    const discountValue = parseFloat(discount) || 0
    console.log('Applying discount:', discountValue)
    // dispatch(applyDiscountToCart(discountValue))
  }, [discount])

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <Typography variant='h4'>Point of Sale</Typography>
            <Typography>Process sales and manage transactions</Typography>
          </div>
          <div className='flex gap-4'>
            <Button 
              variant='tonal' 
              color='secondary'
              onClick={() => router.push('/apps/pos/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button 
              variant='contained' 
              startIcon={<i className='tabler-receipt' />}
              disabled={items.length === 0}
              onClick={handleCompleteSale}
            >
              Complete Sale
            </Button>
          </div>
        </div>
      </div>
      
      <Grid container spacing={6}>
        {/* Left Column - Products and Cart */}
        <Grid item xs={12} lg={8} component='div'>
          <Card>
            <CardHeader title='Products' />
            <CardContent>
              <ProductSearch 
                onProductSelect={(product: any) => {
                // In a real app, this would dispatch an action to add the product to the cart
                console.log('Selected product:', product)
                // dispatch(addToCart({ product, quantity: 1 }))
              }} />
              
              <Divider className='mbe-6' />
              
              <CartItems 
                items={items}
                onQuantityChange={(productId: number, quantity: number) => {
                  // In a real app, this would dispatch an action to update the cart
                  console.log(`Update product ${productId} quantity to ${quantity}`)
                  // dispatch(updateCartItem({ productId, quantity }))
                }}
                onRemoveItem={(productId: number) => {
                  // In a real app, this would dispatch an action to remove the item from the cart
                  console.log('Remove product:', productId)
                  // dispatch(removeFromCart(productId))
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right Column - Order Summary and Payment */}
        <Grid item xs={12} lg={4} component='div'>
          <Card>
            <CardHeader title='Order Summary' />
            <CardContent className='flex flex-col gap-4'>
              {/* Customer Selection */}
              <div>
                <Typography variant='subtitle2' className='mbe-2'>
                  Customer
                </Typography>
                <CustomerSelector 
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  onSelectCustomer={(customer: Customer | null) => setSelectedCustomer(customer)}
                  onAddNewCustomer={() => console.log('Add new customer')}
                />
              </div>
              
              <Divider />
              
              {/* Order Totals */}
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </div>
                
                <div className='flex justify-between'>
                  <Typography>Tax (10%):</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </div>
                
                <div className='flex items-center gap-2 mbe-2'>
                  <TextField
                    size='small'
                    placeholder='Discount'
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                    }}
                    className='flex-1'
                  />
                  <Button variant='tonal' onClick={applyDiscount}>
                    Apply
                  </Button>
                </div>
                
                <Divider />
                
                <div className='flex justify-between font-medium'>
                  <Typography>Total:</Typography>
                  <Typography variant='h6'>${total.toFixed(2)}</Typography>
                </div>
              </div>
              
              <Divider />
              
              {/* Payment Method */}
              <div>
                <Typography variant='subtitle2' className='mbe-2'>
                  Payment Method
                </Typography>
                <PaymentMethod 
                  value={paymentMethod}
                  onChange={(method: PaymentMethodType) => setPaymentMethod(method)}
                />
              </div>
              
              {/* Amount Tendered */}
              <div>
                <Typography variant='subtitle2' className='mbe-2'>
                  Amount Tendered
                </Typography>
                <TextField
                  fullWidth
                  size='small'
                  type='number'
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  }}
                />
              </div>
              
              {/* Change Due */}
              {amountTendered && (
                <div className='flex justify-between font-medium'>
                  <Typography>Change Due:</Typography>
                  <Typography color={changeDue >= 0 ? 'success.main' : 'error.main'}>
                    ${Math.abs(changeDue).toFixed(2)} {changeDue < 0 ? 'more needed' : ''}
                  </Typography>
                </div>
              )}
              
              {/* Complete Sale Button */}
              <Button 
                variant='contained' 
                size='large' 
                fullWidth 
                className='mbs-4'
                startIcon={<i className='tabler-check' />}
                disabled={items.length === 0 || (paymentMethod === 'card' && (changeDue < 0))}
                onClick={handleCompleteSale}
              >
                Complete Sale
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default PosCheckout
