// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

// Third-party Imports
import { format } from 'date-fns'

// Types
type OrderType = {
  id: string
  orderNumber: string
  customer: string
  total: number
  status: 'completed' | 'pending' | 'cancelled'
  date: string
}

type Props = {
  orders: OrderType[]
}

const RecentOrders = ({ orders }: Props) => {
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <div className='flex justify-between items-center p-6'>
        <Typography variant='h5'>Recent Orders</Typography>
        <Button variant='tonal' size='small'>
          View All
        </Button>
      </div>
      <CardContent className='p-0'>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant='body2' className='font-medium'>
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status) as any}
                      size='small'
                      variant='tonal'
                    />
                  </TableCell>
                  <TableCell>
                    <Button size='small' variant='tonal'>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default RecentOrders
