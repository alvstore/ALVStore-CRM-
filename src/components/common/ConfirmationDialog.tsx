'use client'

// React Imports
import { ReactNode } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

interface ConfirmationDialogProps {
  open: boolean
  title: string
  content: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  confirmColor?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning'
  loading?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fullWidth?: boolean
}

/**
 * A reusable confirmation dialog component
 * @param {boolean} open - Controls the visibility of the dialog
 * @param {string} title - The title of the dialog
 * @param {ReactNode} content - The content to display in the dialog body
 * @param {string} [confirmText='Confirm'] - Text for the confirm button
 * @param {string} [cancelText='Cancel'] - Text for the cancel button
 * @param {Function} onConfirm - Callback when confirm button is clicked
 * @param {Function} onCancel - Callback when cancel button is clicked or dialog is closed
 * @param {string} [confirmColor='primary'] - Color of the confirm button
 * @param {boolean} [loading=false] - Shows loading state on confirm button
 * @param {string} [maxWidth='sm'] - Maximum width of the dialog
 * @param {boolean} [fullWidth=true] - Whether the dialog should be full width
 */
const ConfirmationDialog = ({
  open,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'primary',
  loading = false,
  maxWidth = 'sm',
  fullWidth = true
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onCancel()
        }
      }}
      aria-labelledby='confirmation-dialog-title'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle id='confirmation-dialog-title' className='flex flex-col gap-2 text-center pbs-0 pbe-6 sm:pbe-5 sm:!p-6'>
        <IconButton
          size='small'
          onClick={onCancel}
          className='absolute block-start-4 inline-end-4 text-textSecondary'
        >
          <i className='tabler-x' />
        </IconButton>
        <Typography variant='h5' component='span' className='mbe-1'>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent className='flex flex-col items-center text-center pbs-0 pbe-6 sm:pbe-5 sm:px-6'>
        <div className='flex flex-col items-center gap-2'>
          {typeof content === 'string' ? (
            <Typography className='text-center'>{content}</Typography>
          ) : (
            content
          )}
        </div>
      </DialogContent>
      <DialogActions className='justify-center gap-4 pbs-0 pbe-6 sm:pbe-5 sm:px-6'>
        <Button variant='outlined' color='secondary' onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant='contained'
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <i className='tabler-loader-2 animate-spin' />
            ) : null
          }
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
