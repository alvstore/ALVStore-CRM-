'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Button,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import ClientForm from '@/modules/clients/components/ClientForm';
import ContactsTab from '@/modules/clients/components/ContactsTab';
import FilesTab from '@/modules/clients/components/FilesTab';
import { useClientStore } from '@/modules/clients/store/clientStore';
import { ClientFormData, ContactFormData } from '@/modules/clients/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ClientDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const {
    selectedClient,
    loading,
    error,
    fetchClientById,
    updateClient,
    addContact,
    updateContact,
    deleteContact,
    uploadFile,
    deleteFile,
    clearError,
  } = useClientStore();

  const [tabValue, setTabValue] = React.useState(0);
  const [editFormOpen, setEditFormOpen] = React.useState(false);

  const clientId = params.id as string;

  React.useEffect(() => {
    if (clientId) {
      fetchClientById(clientId);
    }
  }, [clientId, fetchClientById]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleUpdateClient = async (data: ClientFormData) => {
    if (!selectedClient) return;
    
    try {
      const clientData = {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        notes: data.notes,
        status: data.status,
        tags: data.tags,
      };
      await updateClient(selectedClient.id, clientData);
      enqueueSnackbar('Client updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update client', { variant: 'error' });
      throw error;
    }
  };

  const handleAddContact = async (data: ContactFormData) => {
    if (!selectedClient) return;
    await addContact(selectedClient.id, data);
  };

  const handleUpdateContact = async (contactId: string, data: ContactFormData) => {
    if (!selectedClient) return;
    await updateContact(selectedClient.id, contactId, data);
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!selectedClient) return;
    await deleteContact(selectedClient.id, contactId);
  };

  const handleUploadFile = async (file: File) => {
    if (!selectedClient) return;
    await uploadFile(selectedClient.id, file);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!selectedClient) return;
    await deleteFile(selectedClient.id, fileId);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatAddress = (address: any) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !selectedClient) {
    return <LoadingSpinner fullScreen message="Loading client details..." />;
  }

  if (!selectedClient) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="text.secondary">
          Client not found
        </Typography>
      </Box>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <IconButton onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Client Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditFormOpen(true)}
          >
            Edit Client
          </Button>
        </Box>

        {/* Client Header Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="flex-start" gap={3}>
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {selectedClient.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {selectedClient.name}
                    </Typography>
                    
                    {selectedClient.company && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <BusinessIcon color="action" />
                        <Typography variant="body1">{selectedClient.company}</Typography>
                      </Box>
                    )}
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <EmailIcon color="action" />
                      <Typography variant="body1">{selectedClient.email}</Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PhoneIcon color="action" />
                      <Typography variant="body1">{selectedClient.phone}</Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <LocationIcon color="action" sx={{ mt: 0.5 }} />
                      <Typography variant="body1">
                        {formatAddress(selectedClient.address)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                      color={
                        selectedClient.status === 'active' ? 'success' :
                        selectedClient.status === 'lead' ? 'warning' : 'default'
                      }
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tags
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {selectedClient.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                  
                  <Divider />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Orders
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedClient.totalOrders}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Value
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        ${selectedClient.totalValue.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedClient.createdAt)}
                    </Typography>
                  </Box>
                  
                  {selectedClient.lastOrderDate && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Order
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(selectedClient.lastOrderDate)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            {selectedClient.notes && (
              <Box mt={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2">
                  {selectedClient.notes}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Contacts (${selectedClient.contacts.length})`} />
              <Tab label={`Files (${selectedClient.files.length})`} />
              <Tab label="Activity" />
              <Tab label="Orders" />
            </Tabs>
          </Box>
          
          <CardContent>
            <TabPanel value={tabValue} index={0}>
              <ContactsTab
                contacts={selectedClient.contacts}
                onAddContact={handleAddContact}
                onUpdateContact={handleUpdateContact}
                onDeleteContact={handleDeleteContact}
                loading={loading}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <FilesTab
                files={selectedClient.files}
                onUploadFile={handleUploadFile}
                onDeleteFile={handleDeleteFile}
                loading={loading}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" color="text.secondary">
                Activity timeline coming soon...
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Typography variant="body1" color="text.secondary">
                Order history coming soon...
              </Typography>
            </TabPanel>
          </CardContent>
        </Card>

        <ClientForm
          open={editFormOpen}
          onClose={() => setEditFormOpen(false)}
          onSubmit={handleUpdateClient}
          initialData={{
            name: selectedClient.name,
            company: selectedClient.company || '',
            email: selectedClient.email,
            phone: selectedClient.phone,
            street: selectedClient.address.street,
            city: selectedClient.address.city,
            state: selectedClient.address.state,
            zipCode: selectedClient.address.zipCode,
            country: selectedClient.address.country,
            notes: selectedClient.notes || '',
            status: selectedClient.status,
            tags: selectedClient.tags,
          }}
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default ClientDetailPage;