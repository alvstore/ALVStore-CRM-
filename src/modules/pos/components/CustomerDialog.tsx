import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon } from '@mui/icons-material';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
  customers: Customer[];
  loading?: boolean;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onClose,
  onSelectCustomer,
  customers,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setFilteredCustomers(customers);
    }
  }, [open, customers]);

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = customers.filter(
        customer =>
          customer.name.toLowerCase().includes(lowercaseSearch) ||
          customer.email.toLowerCase().includes(lowercaseSearch) ||
          customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon />
          <Typography variant="h6">Select Customer</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            autoFocus
            disabled={loading}
          />
          
          <Box sx={{ mt: 3, maxHeight: 400, overflow: 'auto' }}>
            <List>
              {filteredCustomers.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No customers found" 
                    secondary="Try a different search term or create a new customer"
                  />
                </ListItem>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <React.Fragment key={customer.id}>
                    <ListItem 
                      button 
                      onClick={() => handleSelectCustomer(customer)}
                      disabled={loading}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {customer.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={customer.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {customer.email}
                            </Typography>
                            {` — ${customer.phone}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < filteredCustomers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={() => onClose()}
          disabled={loading}
        >
          Skip
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog;