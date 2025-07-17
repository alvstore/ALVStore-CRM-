// React Imports
import { useCallback } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'

// Types
type PaymentMethodType = 'cash' | 'card' | 'upi' | 'other'

type PaymentMethod = {
  id: PaymentMethodType
  label: string
  icon: string
}

type Props = {
  value: PaymentMethodType
  onChange: (method: PaymentMethodType) => void
  className?: string
}

// Payment methods data
const paymentMethods: PaymentMethod[] = [
  { id: 'cash', label: 'Cash', icon: 'tabler-coin' },
  { id: 'card', label: 'Card', icon: 'tabler-credit-card' },
  { id: 'upi', label: 'UPI', icon: 'tabler-device-mobile' },
  { id: 'other', label: 'Other', icon: 'tabler-receipt' }
]

// Styled component for payment method button
const PaymentButton = styled(Button)(({ theme }) => ({
  flex: 1,
  flexDirection: 'column',
  height: 'auto',
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  '&.active': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
  },
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 'auto',
    '&:not(:last-child)': {
      marginRight: theme.spacing(1)
    }
  }
}))

const PaymentMethod = ({ value, onChange, className }: Props) => {
  const handleMethodChange = useCallback((methodId: PaymentMethodType) => {
    onChange(methodId)
  }, [onChange])

  return (
    <Box className={className}>
      <div className='flex flex-wrap gap-2'>
        {paymentMethods.map((method) => {
          const isActive = value === method.id
          
          return (
            <PaymentButton
              key={method.id}
              variant={isActive ? 'contained' : 'outlined'}
              color={isActive ? 'primary' : 'secondary'}
              className={isActive ? 'active' : ''}
              onClick={() => handleMethodChange(method.id)}
            >
              <i className={classnames(method.icon, 'text-2xl mbe-1')} />
              <span>{method.label}</span>
            </PaymentButton>
          )
        })}
      </div>
    </Box>
  )
}

export default PaymentMethod
