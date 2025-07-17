// React Imports
import { useCallback } from 'react'

// MUI Imports
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'

// Types
type CartItem = {
  product: {
    id: number
    name: string
    price: number
    image?: string
  }
  quantity: number
  price: number
  discount: number
  tax: number
  total: number
}

type Props = {
  items: CartItem[]
  onQuantityChange: (productId: number, quantity: number) => void
  onRemoveItem: (productId: number) => void
}

const CartItems = ({ items, onQuantityChange, onRemoveItem }: Props) => {
  // Memoize handlers to prevent unnecessary re-renders
  const handleQuantityChange = useCallback((productId: number, value: string) => {
    const quantity = parseInt(value, 10) || 1
    onQuantityChange(productId, quantity)
  }, [onQuantityChange])
  
  const handleIncrement = useCallback((productId: number, currentQty: number) => {
    onQuantityChange(productId, currentQty + 1)
  }, [onQuantityChange])
  
  const handleDecrement = useCallback((productId: number, currentQty: number) => {
    if (currentQty > 1) {
      onQuantityChange(productId, currentQty - 1)
    } else {
      onRemoveItem(productId)
    }
  }, [onQuantityChange, onRemoveItem])

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center'>
        <i className='tabler-shopping-cart text-5xl mbe-4 text-textDisabled' />
        <Typography variant='h6' className='mbe-2'>
          Your cart is empty
        </Typography>
        <Typography variant='body2' color='text.disabled'>
          Start adding products to see them here
        </Typography>
      </div>
    )
  }

  return (
    <TableContainer component={Paper} elevation={0} variant='outlined'>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align='right'>Price</TableCell>
            <TableCell align='center'>Quantity</TableCell>
            <TableCell align='right'>Total</TableCell>
            <TableCell align='right'>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.product.id} hover>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Avatar 
                    variant='rounded' 
                    src={item.product.image}
                    className='bs-10 is-10'
                  >
                    {item.product.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Typography variant='subtitle2' className='font-medium'>
                      {item.product.name}
                    </Typography>
                    <Typography variant='caption' color='text.disabled'>
                      ${item.product.price.toFixed(2)} each
                    </Typography>
                  </div>
                </div>
              </TableCell>
              <TableCell align='right'>
                ${item.price.toFixed(2)}
              </TableCell>
              <TableCell align='center' className='p-0'>
                <div className='flex items-center justify-center'>
                  <IconButton 
                    size='small' 
                    onClick={() => handleDecrement(item.product.id, item.quantity)}
                  >
                    <i className='tabler-minus text-xl' />
                  </IconButton>
                  <TextField
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                    type='number'
                    size='small'
                    className='w-16 [&_input]:text-center'
                    inputProps={{
                      min: 1,
                      className: 'p-1',
                      style: { textAlign: 'center' }
                    }}
                  />
                  <IconButton 
                    size='small' 
                    onClick={() => handleIncrement(item.product.id, item.quantity)}
                  >
                    <i className='tabler-plus text-xl' />
                  </IconButton>
                </div>
              </TableCell>
              <TableCell align='right' className='font-medium'>
                ${item.total.toFixed(2)}
              </TableCell>
              <TableCell align='right'>
                <IconButton 
                  size='small' 
                  color='error'
                  onClick={() => onRemoveItem(item.product.id)}
                >
                  <i className='tabler-trash text-xl' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CartItems
