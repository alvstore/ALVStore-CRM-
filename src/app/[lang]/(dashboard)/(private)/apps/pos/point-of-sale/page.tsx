'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import PosCart from '@/views/apps/pos/PosCart'
import PosProducts from '@/views/apps/pos/PosProducts'

const PointOfSalePage = () => {
  // States
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([])

  // Handle add to cart
  const handleAddToCart = (product: { id: number; name: string; price: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  // Handle remove from cart
  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId)
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      
      return prevCart.filter(item => item.id !== productId)
    })
  }

  // Handle clear cart
  const handleClearCart = () => {
    setCart([])
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title='Products' />
          <CardContent>
            <PosProducts onAddToCart={handleAddToCart} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title='Cart' />
          <CardContent>
            {cart.length > 0 ? (
              <PosCart 
                cart={cart} 
                onRemoveItem={handleRemoveFromCart} 
                onClearCart={handleClearCart}
              />
            ) : (
              <Typography>Your cart is empty</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PointOfSalePage
