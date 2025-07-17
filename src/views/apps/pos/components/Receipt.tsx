// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Third-party Imports
import { format } from 'date-fns'

// Types
type OrderItem = {
  productId: number
  quantity: number
  price: number
  total: number
  notes?: string
}

type Customer = {
  id: number
  customer: string
  email?: string
  phone?: string
  address?: string
}

type Order = {
  id: string
  orderNumber: string
  customer?: Customer
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  status: string
  notes?: string
  createdAt: string
  createdBy: number
}

type Props = {
  order: Order
  className?: string
}

const Receipt = ({ order, className }: Props) => {
  // Hooks
  const theme = useTheme()
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a')
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  // Get payment method label
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Cash'
      case 'card':
        return 'Credit/Debit Card'
      case 'upi':
        return 'UPI Payment'
      default:
        return method
    }
  }

  return (
    <Paper 
      elevation={0} 
      className={classnames('max-w-md mx-auto p-6 print:shadow-none', className)}
      sx={{
        '@media print': {
          boxShadow: 'none',
          width: '100mm',
          maxWidth: '100%',
          padding: 0
        }
      }}
    >
      {/* Header */}
      <Box className='text-center mbe-6'>
        <Avatar 
          src='/images/logos/logo.png' 
          className='w-16 h-16 mx-auto mbe-2'
          variant='rounded'
        />
        <Typography variant='h5' className='font-bold'>
          Your Store Name
        </Typography>
        <Typography variant='body2' color='text.disabled'>
          123 Business Street, City, Country
        </Typography>
        <Typography variant='body2' color='text.disabled'>
          Phone: (123) 456-7890 | Email: info@yourstore.com
        </Typography>
      </Box>
      
      <Divider className='mbe-4' />
      
      {/* Order Info */}
      <Box className='flex justify-between mbe-4'>
        <div>
          <Typography variant='subtitle2' className='font-medium'>
            Order #{order.orderNumber}
          </Typography>
          <Typography variant='caption' color='text.disabled'>
            {formatDate(order.createdAt)}
          </Typography>
        </div>
        <div className='text-right'>
          <Typography variant='subtitle2' className='font-medium'>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Typography>
          <Typography variant='caption' color='text.disabled'>
            {getPaymentMethodLabel(order.paymentMethod)}
          </Typography>
        </div>
      </Box>
      
      {/* Customer Info */}
      {order.customer && (
        <Box className='p-4 bg-action-hover rounded mbe-4'>
          <Typography variant='subtitle2' className='font-medium mbe-2'>
            Customer
          </Typography>
          <Typography variant='body2'>{order.customer.customer}</Typography>
          {order.customer.email && (
            <Typography variant='body2'>{order.customer.email}</Typography>
          )}
          {order.customer.phone && (
            <Typography variant='body2'>{order.customer.phone}</Typography>
          )}
          {order.customer.address && (
            <Typography variant='body2'>{order.customer.address}</Typography>
          )}
        </Box>
      )}
      
      {/* Order Items */}
      <Box className='mbe-4'>
        <Box className='flex justify-between p-2 bg-action-hover rounded-t'>
          <Typography variant='subtitle2' className='font-medium'>
            Items
          </Typography>
          <Typography variant='subtitle2' className='font-medium'>
            Total
          </Typography>
        </Box>
        
        <Box className='border border-t-0 rounded-b'>
          {order.items.map((item, index) => (
            <Box 
              key={index} 
              className='flex justify-between p-2 border-b last:border-b-0'
            >
              <div>
                <Typography variant='body2' className='font-medium'>
                  {item.quantity} x Product {item.productId}
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                  {formatCurrency(item.price)} each
                </Typography>
              </div>
              <Typography variant='body2' className='font-medium'>
                {formatCurrency(item.total)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Order Summary */}
      <Box className='mbe-6'>
        <Box className='flex justify-between mbe-1'>
          <Typography>Subtotal:</Typography>
          <Typography>{formatCurrency(order.subtotal)}</Typography>
        </Box>
        <Box className='flex justify-between mbe-1'>
          <Typography>Tax ({Math.round((order.tax / order.subtotal) * 100)}%):</Typography>
          <Typography>{formatCurrency(order.tax)}</Typography>
        </Box>
        {order.discount > 0 && (
          <Box className='flex justify-between mbe-1'>
            <Typography>Discount:</Typography>
            <Typography color='error'>-{formatCurrency(order.discount)}</Typography>
          </Box>
        )}
        <Divider className='mbe-2' />
        <Box className='flex justify-between font-bold'>
          <Typography>Total:</Typography>
          <Typography>{formatCurrency(order.total)}</Typography>
        </Box>
      </Box>
      
      {/* Notes */}
      {order.notes && (
        <Box className='p-4 bg-action-hover rounded mbe-6'>
          <Typography variant='subtitle2' className='font-medium mbe-1'>
            Notes
          </Typography>
          <Typography variant='body2'>{order.notes}</Typography>
        </Box>
      )}
      
      {/* Footer */}
      <Box className='text-center'>
        <Divider className='mbe-4' />
        <Typography variant='caption' color='text.disabled'>
          Thank you for shopping with us!
        </Typography>
        <Typography variant='caption' color='text.disabled' className='block'>
          Please visit us again
        </Typography>
        <Typography variant='caption' color='text.disabled' className='block'>
          {format(new Date(), 'yyyy')} © Your Store Name. All rights reserved.
        </Typography>
      </Box>
    </Paper>
  )
}

export default Receipt
