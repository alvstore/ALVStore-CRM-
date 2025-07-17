'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { useRouter, useParams } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'

// Type Imports
import type { POSOrderType } from '@/types/apps/posTypes'

// Component Imports
import Receipt from '@/views/apps/pos/components/Receipt'

// Mock Data
const order: POSOrderType = {
  id: '123',
  orderNumber: 'ORD-00123',
  customer: {
    id: 1,
    customer: 'John Doe',
    customerId: 'CUST-001',
    email: 'john@example.com',
    country: 'USA',
    countryCode: 'US',
    order: 5,
    totalSpent: 1250,
    avatar: '/images/avatars/1.png'
  },
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 99.99,
      discount: 0,
      tax: 19.99,
      total: 219.97,
      notes: ''
    },
    {
      productId: 2,
      quantity: 1,
      price: 149.99,
      discount: 0,
      tax: 15.00,
      total: 164.99,
      notes: ''
    }
  ],
  subtotal: 249.97,
  tax: 34.99,
  discount: 0,
  total: 284.96,
  paymentMethod: 'card',
  status: 'completed',
  notes: 'Thank you for your business!',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 1
}

const ReceiptPage = () => {
  // Hooks
  const router = useRouter()
  const params = useParams()
  const [isPrinting, setIsPrinting] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)
  
  // In a real app, you would fetch the order details using the ID from the URL
  // const { data: order, isLoading } = useGetOrderByIdQuery(params.id as string)
  
  // Handle print
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    },
    onAfterPrint: () => {
      setIsPrinting(false)
    }
  })
  
  // Handle new sale
  const handleNewSale = () => {
    // In a real app, this would clear the cart and start a new sale
    // dispatch(clearCart())
    router.push('/apps/pos/checkout')
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <Typography variant='h4'>Order Receipt</Typography>
          <Typography>Order #{order.orderNumber}</Typography>
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
            startIcon={<i className='tabler-printer' />}
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? 'Printing...' : 'Print Receipt'}
          </Button>
          <Button 
            variant='contained' 
            startIcon={<i className='tabler-plus' />}
            onClick={handleNewSale}
          >
            New Sale
          </Button>
        </div>
      </div>
      
      <Grid container spacing={6}>
        <Grid xs={12} md={8} lg={6} className='md:mis-auto lg:mie-auto'>
          <Card>
            <CardContent ref={receiptRef} className='print:p-0'>
              <Receipt order={order} />
            </CardContent>
            <div className='flex justify-end p-6 print:hidden'>
              <Button 
                variant='contained' 
                startIcon={<i className='tabler-printer' />}
                onClick={handlePrint}
                disabled={isPrinting}
                className='mbe-4'
              >
                {isPrinting ? 'Printing...' : 'Print Receipt'}
              </Button>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default ReceiptPage
