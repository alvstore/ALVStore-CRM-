'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { ContactPerson, ContactFormData } from '../types';
import ContactForm from './ContactForm';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { useSnackbar } from 'notistack';

interface ContactsTabProps {
  contacts: ContactPerson[];
  onAddContact: (data: ContactFormData) => Promise<void>;
  onUpdateContact: (contactId: string, data: ContactFormData) => Promise<void>;
  onDeleteContact: (contactId: string) => Promise<void>;
  loading?: boolean;
}

const ContactsTab: React.FC<ContactsTabProps> = ({
  contacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  loading = false,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<ContactPerson | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [contactToDelete, setContactToDelete] = React.useState<ContactPerson | null>(null);

  const handleAddContact = async (data: ContactFormData) => {
    try {
      await onAddContact(data);
      enqueueSnackbar('Contact added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to add contact', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateContact = async (data: ContactFormData) => {
    if (!editingContact) return;
    
    try {
      await onUpdateContact(editingContact.id, data);
      enqueueSnackbar('Contact updated successfully', { variant: 'success' });
      setEditingContact(null);
    } catch (error) {
      enqueueSnackbar('Failed to update contact', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      await onDeleteContact(contactToDelete.id);
      enqueueSnackbar('Contact deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete contact', { variant: 'error' });
    }
  };

  const openDeleteDialog = (contact: ContactPerson) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (contact: ContactPerson) => {
    setEditingContact(contact);
    setFormOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Contacts ({contacts.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Add Contact
        </Button>
      </Box>

      {contacts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No contacts added yet. Click "Add Contact" to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {contacts.map((contact) => (
            <Grid item xs={12} md={6} key={contact.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {contact.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6">
                            {contact.name}
                          </Typography>
                          {contact.isPrimary && (
                            <StarIcon color="warning" fontSize="small" />
                          )}
                        </Box>
                        {contact.position && (
                          <Typography variant="body2" color="text.secondary">
                            {contact.position}
                            {contact.department && ` • ${contact.department}`}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(contact)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => openDeleteDialog(contact)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{contact.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{contact.phone}</Typography>
                    </Box>
                  </Box>

                  {contact.isPrimary && (
                    <Box mt={2}>
                      <Chip
                        label="Primary Contact"
                        color="warning"
                        size="small"
                        icon={<StarIcon />}
                      />
                    </Box>
                  )}

                  {contact.notes && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">
                        {contact.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ContactForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingContact(null);
        }}
        onSubmit={editingContact ? handleUpdateContact : handleAddContact}
        initialData={editingContact || undefined}
        loading={loading}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Contact"
        message={`Are you sure you want to delete ${contactToDelete?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteContact}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setContactToDelete(null);
        }}
        severity="error"
        confirmText="Delete"
        loading={loading}
      />
    </Box>
  );
};

export default ContactsTab;