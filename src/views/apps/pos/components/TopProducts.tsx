// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

// Third-party Imports
import { styled } from '@mui/material/styles'

// Types
type ProductType = {
  id: number
  name: string
  sales: number
  revenue: number
}

type Props = {
  products: ProductType[]
}

// Styled components
const StyledAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
  color: 'var(--mui-palette-primary-main)'
})

const TopProducts = ({ products }: Props) => {
  // Find max sales for progress calculation
  const maxSales = Math.max(...products.map(p => p.sales), 0)

  return (
    <Card>
      <CardHeader title='Top Selling Products' />
      <CardContent>
        <List className='p-0'>
          {products.map((product, index) => (
            <ListItem key={product.id} className='p-0 mbe-4 last:mbe-0'>
              <ListItemAvatar className='mbe-2'>
                <StyledAvatar>{index + 1}</StyledAvatar>
              </ListItemAvatar>
              <div className='flex flex-col flex-auto gap-1'>
                <div className='flex justify-between items-center'>
                  <Typography variant='subtitle2' className='font-medium'>
                    {product.name}
                  </Typography>
                  <Typography variant='body2' color='text.disabled'>
                    {product.sales} sold
                  </Typography>
                </div>
                <LinearProgress 
                  variant='determinate' 
                  value={(product.sales / maxSales) * 100} 
                  className='bs-2 rounded-full'
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'var(--mui-palette-primary-main)'
                    },
                    backgroundColor: 'var(--mui-palette-action-selected)'
                  }}
                />
                <div className='flex justify-between'>
                  <Typography variant='caption' color='text.disabled'>
                    ${product.revenue.toFixed(2)}
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    {((product.sales / maxSales) * 100).toFixed(0)}%
                  </Typography>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default TopProducts
