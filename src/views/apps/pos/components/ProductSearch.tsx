'use client'

// React Imports
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { useClickAway } from 'react-use'

// Types
type ProductType = {
  id: number
  name: string
  price: number
  sku: string
  image?: string
}

type Props = {
  onProductSelect: (product: ProductType) => void
}

// Mock data - in a real app, this would come from an API
const mockProducts: ProductType[] = [
  { id: 1, name: 'Wireless Earbuds', price: 99.99, sku: 'SKU-001' },
  { id: 2, name: 'Smart Watch', price: 199.99, sku: 'SKU-002' },
  { id: 3, name: 'Bluetooth Speaker', price: 79.99, sku: 'SKU-003' },
  { id: 4, name: 'USB-C Cable', price: 12.99, sku: 'SKU-004' },
  { id: 5, name: 'Phone Case', price: 24.99, sku: 'SKU-005' },
  { id: 6, name: 'Wireless Charger', price: 34.99, sku: 'SKU-006' },
  { id: 7, name: 'Laptop Stand', price: 45.99, sku: 'SKU-007' },
  { id: 8, name: 'HDMI Cable', price: 15.99, sku: 'SKU-008' },
]

const ProductSearch = ({ onProductSelect }: Props) => {
  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    const term = searchTerm.toLowerCase().trim()
    return mockProducts.filter(
      product => 
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term)
    )
  }, [searchTerm])
  
  // Handle click outside to close dropdown
  const handleClickAway = useCallback(() => {
    setIsOpen(false)
  }, [])
  
  useClickAway(containerRef, handleClickAway)
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredProducts.length - 1 ? prev + 1 : prev
          )
          break
          
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
          break
          
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
            handleProductSelect(filteredProducts[selectedIndex])
          }
          break
          
        case 'Escape':
          setIsOpen(false)
          break
          
        default:
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredProducts])
  
  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setSelectedIndex(-1)
    setIsOpen(!!value.trim())
  }, [])
  
  // Handle product selection
  const handleProductSelect = (product: ProductType) => {
    onProductSelect(product)
    setSearchTerm('')
    setIsOpen(false)
    inputRef.current?.focus()
  }
  
  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (searchTerm.trim() && filteredProducts.length > 0) {
      setIsOpen(true)
    }
  }, [searchTerm, filteredProducts.length])

  return (
    <div className='relative' ref={containerRef}>
      <TextField
        fullWidth
        placeholder='Search products by name or SKU...'
        variant='outlined'
        size='small'
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        inputRef={inputRef}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <i className='tabler-search' />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position='end'>
              <IconButton
                size='small'
                onClick={() => {
                  setSearchTerm('')
                  setIsOpen(false)
                  inputRef.current?.focus()
                }}
              >
                <i className='tabler-x' />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      
      {isOpen && filteredProducts.length > 0 && (
        <Paper 
          className='absolute w-full mt-1 z-10 shadow-lg max-h-80 overflow-auto'
          elevation={3}
        >
          <List className='p-0'>
            {filteredProducts.map((product, index) => (
              <ListItem
                key={product.id}
                className={`cursor-pointer hover:bg-action-hover ${
                  selectedIndex === index ? 'bg-action-selected' : ''
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <ListItemAvatar>
                  <Avatar 
                    variant='rounded' 
                    src={product.image}
                    className='bs-10 is-10'
                  >
                    {product.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography variant='subtitle2' noWrap>
                      {product.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant='caption' color='text.disabled'>
                      SKU: {product.sku}
                    </Typography>
                  }
                />
                <Typography variant='subtitle2' className='font-medium'>
                  ${product.price.toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  )
}

export default ProductSearch
