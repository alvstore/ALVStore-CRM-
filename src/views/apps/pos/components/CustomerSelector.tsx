'use client'

// React Imports
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { useClickAway } from 'react-use'

// Types
type Customer = {
  id: number
  customer: string
  email: string
  avatar?: string
  phone?: string
}

type Props = {
  customers: Customer[]
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer | null) => void
  onAddNewCustomer: () => void
}

const CustomerSelector = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer
}: Props) => {
  // States
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers)
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Filter customers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers)
    } else {
      const term = searchTerm.toLowerCase().trim()
      setFilteredCustomers(
        customers.filter(
          customer =>
            customer.customer.toLowerCase().includes(term) ||
            customer.email.toLowerCase().includes(term) ||
            (customer.phone && customer.phone.includes(term))
        )
      )
    }
  }, [searchTerm, customers])
  
  // Handle click outside to close dropdown
  const handleClickAway = useCallback(() => {
    setIsOpen(false)
  }, [])
  
  useClickAway(containerRef, handleClickAway)
  
  // Handle customer selection
  const handleSelectCustomer = useCallback((customer: Customer) => {
    onSelectCustomer(customer)
    setIsOpen(false)
    setSearchTerm('')
  }, [onSelectCustomer])
  
  // Clear selected customer
  const handleClearCustomer = useCallback(() => {
    onSelectCustomer(null)
    setSearchTerm('')
  }, [onSelectCustomer])

  return (
    <div className='relative' ref={containerRef}>
      {selectedCustomer ? (
        <div className='flex items-center justify-between p-2 border rounded'>
          <div className='flex items-center gap-3'>
            <Avatar src={selectedCustomer.avatar} alt={selectedCustomer.customer} />
            <div>
              <Typography variant='subtitle2' className='font-medium'>
                {selectedCustomer.customer}
              </Typography>
              <Typography variant='caption' color='text.disabled'>
                {selectedCustomer.email}
                {selectedCustomer.phone && ` • ${selectedCustomer.phone}`}
              </Typography>
            </div>
          </div>
          <IconButton size='small' onClick={handleClearCustomer}>
            <i className='tabler-x text-xl' />
          </IconButton>
        </div>
      ) : (
        <>
          <TextField
            fullWidth
            placeholder='Search customer...'
            size='small'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              if (e.target.value.trim()) {
                setIsOpen(true)
              }
            }}
            onFocus={() => {
              if (searchTerm.trim() || customers.length > 0) {
                setIsOpen(true)
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='tabler-user' />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position='end'>
                  <IconButton
                    size='small'
                    onClick={() => {
                      setSearchTerm('')
                      setIsOpen(false)
                    }}
                  >
                    <i className='tabler-x' />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          {isOpen && (
            <Paper 
              className='absolute w-full mt-1 z-10 shadow-lg max-h-80 overflow-auto'
              elevation={3}
            >
              <div className='p-2 border-b'>
                <Button 
                  fullWidth 
                  variant='text' 
                  startIcon={<i className='tabler-plus' />}
                  onClick={() => {
                    onAddNewCustomer()
                    setIsOpen(false)
                  }}
                >
                  Add New Customer
                </Button>
              </div>
              
              {filteredCustomers.length > 0 ? (
                <List className='p-0'>
                  {filteredCustomers.map((customer) => (
                    <ListItem
                      key={customer.id}
                      className='cursor-pointer hover:bg-action-hover'
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <ListItemAvatar>
                        <Avatar src={customer.avatar} alt={customer.customer} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Typography variant='subtitle2' noWrap>
                            {customer.customer}
                          </Typography>
                        }
                        secondary={
                          <Typography variant='caption' noWrap>
                            {customer.email}
                            {customer.phone && ` • ${customer.phone}`}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <div className='p-4 text-center'>
                  <Typography variant='body2' color='text.disabled'>
                    No customers found
                  </Typography>
                </div>
              )}
            </Paper>
          )}
        </>
      )}
    </div>
  )
}

export default CustomerSelector
