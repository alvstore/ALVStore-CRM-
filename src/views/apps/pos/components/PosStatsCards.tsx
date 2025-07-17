// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Types
type StatsType = {
  title: string
  stats: string
  icon: string
  color: string
  trendNumber: string
  trend?: 'positive' | 'negative'
}

type Props = {
  stats: {
    totalSales: number
    totalOrders: number
    averageOrder: number
    newCustomers: number
  }
}

const PosStatsCards = ({ stats }: Props) => {
  // Hooks
  const theme = useTheme()
  
  // Stats data
  const statsData: StatsType[] = [
    {
      title: 'Total Sales',
      stats: `$${stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'tabler-currency-dollar',
      color: 'primary',
      trendNumber: '12.5%',
      trend: 'positive'
    },
    {
      title: 'Orders',
      stats: stats.totalOrders.toString(),
      icon: 'tabler-shopping-cart',
      color: 'success',
      trendNumber: '8.2%',
      trend: 'positive'
    },
    {
      title: 'Avg. Order',
      stats: `$${stats.averageOrder.toFixed(2)}`,
      icon: 'tabler-receipt',
      color: 'warning',
      trendNumber: '2.4%',
      trend: 'negative'
    },
    {
      title: 'New Customers',
      stats: stats.newCustomers.toString(),
      icon: 'tabler-users',
      color: 'info',
      trendNumber: '15.7%',
      trend: 'positive'
    }
  ]

  return (
    <Grid container spacing={6}>
      {statsData.map((item, index) => (
        <Grid key={index} xs={12} sm={6} xl={3} md={3}>
          <Card>
            <CardContent>
              <div className='flex justify-between'>
                <div className='flex flex-col'>
                  <Typography variant='h4' className='mbe-1'>
                    {item.stats}
                  </Typography>
                  <Typography variant='body2' color='text.disabled'>
                    {item.title}
                  </Typography>
                </div>
                <div className='flex flex-col items-end'>
                  <CustomAvatar skin='light' color={item.color as any} className='mbe-2'>
                    <i className={classnames('text-2xl', `tabler-${item.icon}`)} />
                  </CustomAvatar>
                  <div className={classnames('flex items-center', {
                    'text-success': item.trend === 'positive',
                    'text-error': item.trend === 'negative'
                  })}>
                    <i className={classnames(
                      'tabler-arrow-up text-xl', 
                      item.trend === 'negative' && 'tabler-arrow-down'
                    )} />
                    <Typography variant='body2' color='inherit' className='font-medium'>
                      {item.trendNumber}
                    </Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default PosStatsCards
