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
import Box from '@mui/material/Box'

// Third-party Imports
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

// Type Imports
import type { RootState } from '@/redux-store'

// Component Imports
import PosStatsCards from '@/views/apps/pos/components/PosStatsCards'
import RecentOrders from '@/views/apps/pos/components/RecentOrders'
import TopProducts from '@/views/apps/pos/components/TopProducts'
import SalesChart from '@/views/apps/pos/components/SalesChart'

// Mock Data
const recentOrders = [
  { id: '1', orderNumber: '#ORD-001', customer: 'John Doe', total: 125.99, status: 'completed', date: '2023-06-15' },
  { id: '2', orderNumber: '#ORD-002', customer: 'Jane Smith', total: 89.50, status: 'completed', date: '2023-06-14' },
  { id: '3', orderNumber: '#ORD-003', customer: 'Bob Johnson', total: 215.75, status: 'completed', date: '2023-06-14' },
  { id: '4', orderNumber: '#ORD-004', customer: 'Alice Brown', total: 42.99, status: 'completed', date: '2023-06-13' },
  { id: '5', orderNumber: '#ORD-005', customer: 'Mike Wilson', total: 178.30, status: 'completed', date: '2023-06-12' }
]

const topProducts = [
  { id: 1, name: 'Wireless Earbuds', sales: 125, revenue: 3125 },
  { id: 2, name: 'Smart Watch', sales: 98, revenue: 4900 },
  { id: 3, name: 'Bluetooth Speaker', sales: 87, revenue: 2175 },
  { id: 4, name: 'USB-C Cable', sales: 156, revenue: 780 },
  { id: 5, name: 'Phone Case', sales: 210, revenue: 1050 }
]

const salesData = [
  { date: '2023-06-01', sales: 1200 },
  { date: '2023-06-02', sales: 980 },
  { date: '2023-06-03', sales: 1500 },
  { date: '2023-06-04', sales: 1100 },
  { date: '2023-06-05', sales: 2000 },
  { date: '2023-06-06', sales: 1800 },
  { date: '2023-06-07', sales: 2500 }
]

const PosDashboard = () => {
  // Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  
  // States
  const [timeRange, setTimeRange] = useState('week')
  
  // Stats
  const stats = {
    totalSales: 12450.75,
    totalOrders: 124,
    averageOrder: 100.41,
    newCustomers: 28
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <Typography variant='h4'>Dashboard</Typography>
            <Typography>Welcome back! Here's what's happening with your store today.</Typography>
          </div>
          <Button 
            variant='contained' 
            startIcon={<i className='tabler-plus' />}
            onClick={() => router.push('/apps/pos/checkout')}
          >
            New Sale
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <PosStatsCards stats={stats} />
      
      <Grid container spacing={6}>
        {/* Sales Chart */}
        <Grid xs={12} lg={8}>
          <Card>
            <CardHeader 
              title='Sales Overview' 
              action={
                <Box className='flex items-center gap-2'>
                  <Button 
                    variant={timeRange === 'week' ? 'contained' : 'tonal'} 
                    size='small'
                    onClick={() => setTimeRange('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={timeRange === 'month' ? 'contained' : 'tonal'} 
                    size='small'
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </Button>
                  <Button 
                    variant={timeRange === 'year' ? 'contained' : 'tonal'} 
                    size='small'
                    onClick={() => setTimeRange('year')}
                  >
                    Year
                  </Button>
                </Box>
              }
            />
            <CardContent>
              <SalesChart data={salesData} />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Top Products */}
        <Grid xs={12} lg={4}>
          <TopProducts products={topProducts} />
        </Grid>
        
        {/* Recent Orders */}
        <Grid xs={12}>
          <RecentOrders orders={recentOrders} />
        </Grid>
      </Grid>
    </div>
  )
}

export default PosDashboard
