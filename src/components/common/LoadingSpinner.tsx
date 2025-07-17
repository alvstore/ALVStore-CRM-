'use client'

// MUI Imports
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

interface LoadingSpinnerProps {
  size?: number | string
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'
  className?: string
  fullScreen?: boolean
}

const LoadingSpinner = ({
  size = 40,
  color = 'primary',
  className = '',
  fullScreen = false
}: LoadingSpinnerProps) => {
  const spinner = (
    <CircularProgress 
      size={size} 
      color={color} 
      className={className} 
    />
  )

  if (fullScreen) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
      >
        {spinner}
      </Box>
    )
  }

  return spinner
}

export default LoadingSpinner
