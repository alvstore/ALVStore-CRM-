// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useForm, Controller } from 'react-hook-form'

// Type Imports
import type { Customer } from '@/types/apps/ecommerceTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

type Props = {
  open: boolean
  handleClose: () => void
  setData: (data: Customer[]) => void
  customerData?: Customer[]
}

type FormValidateType = {
  fullName: string
  email: string
  country: string
}

type FormNonValidateType = {
  contact: string
  address1: string
  address2: string
  town: string
  state: string
  postcode: string
}

type countryType = {
  country: string
}

export const country: { [key: string]: countryType } = {
  india: { country: 'India' },
  australia: { country: 'Australia' },
  france: { country: 'France' },
  brazil: { country: 'Brazil' },
  us: { country: 'United States' },
  china: { country: 'China' }
}

// Vars
const initialData = {
  contact: '',
  address1: '',
  address2: '',
  town: '',
  state: '',
  postcode: ''
}

const AddCustomerDrawer = (props: Props) => {
  // Props
  const { open, handleClose, setData, customerData } = props

  // States
  const [formData, setFormData] = useState<FormNonValidateType>(initialData)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      fullName: '',
      email: '',
      country: ''
    }
  })

  const onSubmit = async (data: FormValidateType) => {
    try {
      // Prepare the customer data for the API
      const [firstName, ...lastNameParts] = data.fullName.split(' ');
      const lastName = lastNameParts.join(' ') || 'Customer';
      
      const customerDataForApi = {
        firstName,
        lastName,
        email: data.email,
        phone: '',
        status: 'active',
        source: 'ecommerce',
        country: country[data.country]?.country || data.country,
        // Add default empty arrays for related records
        contacts: [],
        addresses: [],
        communicationPreferences: {}
      };
      
      console.log('Sending data to API:', customerDataForApi);

      // Send POST request to the API
      const response = await fetch(`${window.location.origin}/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerDataForApi),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to save customer';
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const savedCustomer = await response.json();
      
      // Update the UI with the saved customer data
      const newCustomer = {
        id: savedCustomer.id,
        customer: `${savedCustomer.firstName} ${savedCustomer.lastName}`.trim(),
        customerId: savedCustomer.customerId || `CUST${String(savedCustomer.id).padStart(4, '0')}`,
        email: savedCustomer.email,
        country: savedCustomer.country || 'Unknown',
        countryCode: 'st',
        countryFlag: `/images/cards/${data.country || 'us'}.png`,
        order: Math.floor(Math.random() * 1000) + 1,
        totalSpent: 0, // You can update this based on actual data
        avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`
      };

      // Update the UI state
      setData([...(customerData ?? []), newCustomer]);
      resetForm({ fullName: '', email: '', country: '' });
      handleClose();
      
      // Show success message
      // You can use a toast or alert here
      console.log('Customer saved successfully:', savedCustomer);
      
    } catch (error) {
      console.error('Error saving customer:', error);
      // Handle error (show error message to user)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save customer'}`);
    }
    setFormData(initialData)
    handleClose()
  }

  const handleReset = () => {
    handleClose()
    resetForm({ fullName: '', email: '', country: '' })
    setFormData(initialData)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-6 plb-5'>
        <Typography variant='h5'>Add a Customer</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium'>
              Basic Information
            </Typography>
            <Controller
              name='fullName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Name'
                  placeholder='John Doe'
                  {...(errors.fullName && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='johndoe@gmail.com'
                  {...(errors.email && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />
            <Controller
              name='country'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  id='country'
                  label='Country'
                  {...field}
                  {...(errors.country && { error: true, helperText: 'This field is required.' })}
                >
                  <MenuItem value='india'>India</MenuItem>
                  <MenuItem value='australia'>Australia</MenuItem>
                  <MenuItem value='france'>France</MenuItem>
                  <MenuItem value='brazil'>Brazil</MenuItem>
                  <MenuItem value='us'>USA</MenuItem>
                  <MenuItem value='china'>China</MenuItem>
                </CustomTextField>
              )}
            />
            <Typography color='text.primary' className='font-medium'>
              Shipping Information
            </Typography>
            <CustomTextField
              fullWidth
              label='Address Line 1'
              name='address1'
              placeholder='45 Roker Terrace'
              value={formData.address1}
              onChange={e => setFormData({ ...formData, address1: e.target.value })}
            />
            <CustomTextField
              fullWidth
              label='Address Line 2'
              name='address2'
              placeholder='Street 69'
              value={formData.address2}
              onChange={e => setFormData({ ...formData, address2: e.target.value })}
            />
            <CustomTextField
              fullWidth
              label='Town'
              name='town'
              placeholder='New York'
              value={formData.town}
              onChange={e => setFormData({ ...formData, town: e.target.value })}
            />
            <CustomTextField
              fullWidth
              label='State/Province'
              name='state'
              placeholder='Southern tip'
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
            />
            <CustomTextField
              fullWidth
              label='Post Code'
              name='postcode'
              placeholder='734990'
              value={formData.postcode}
              onChange={e => setFormData({ ...formData, postcode: e.target.value })}
            />
            <CustomTextField
              label='Mobile'
              type='number'
              fullWidth
              placeholder='+(123) 456-7890'
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
            />
            <div className='flex justify-between'>
              <div className='flex flex-col items-start gap-1'>
                <Typography color='text.primary' className='font-medium'>
                  Use as a billing address?
                </Typography>
                <Typography variant='body2'>Please check budget for more info.</Typography>
              </div>
              <Switch defaultChecked />
            </div>
            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit'>
                Add
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
                Discard
              </Button>
            </div>
          </form>
        </div>
      </PerfectScrollbar>
    </Drawer>
  )
}

export default AddCustomerDrawer
