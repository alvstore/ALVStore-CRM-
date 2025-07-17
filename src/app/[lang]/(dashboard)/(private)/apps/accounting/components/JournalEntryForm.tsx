'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { journalEntrySchema } from '../schema';
import { JournalEntryFormData, ChartOfAccount } from '../types';

interface JournalEntryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: JournalEntryFormData) => Promise<void>;
  initialData?: Partial<JournalEntryFormData>;
  loading?: boolean;
  accounts: ChartOfAccount[];
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  accounts,
}) => {
  const methods = useForm<JournalEntryFormData>({
    resolver: yupResolver(journalEntrySchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      entries: [
        {
          accountId: '',
          description: '',
          debit: 0,
          credit: 0,
          reference: '',
        },
        {
          accountId: '',
          description: '',
          debit: 0,
          credit: 0,
          reference: '',
        },
      ],
      ...initialData,
    },
  });

  const { handleSubmit, watch, setValue, reset, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });

  const watchedEntries = watch('entries');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        date: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        entries: [
          {
            accountId: '',
            description: '',
            debit: 0,
            credit: 0,
            reference: '',
          },
          {
            accountId: '',
            description: '',
            debit: 0,
            credit: 0,
            reference: '',
          },
        ],
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: JournalEntryFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const addEntry = () => {
    append({
      accountId: '',
      description: '',
      debit: 0,
      credit: 0,
      reference: '',
    });
  };

  const removeEntry = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const handleDebitChange = (index: number, value: number) => {
    setValue(`entries.${index}.debit`, value);
    setValue(`entries.${index}.credit`, 0);
  };

  const handleCreditChange = (index: number, value: number) => {
    setValue(`entries.${index}.credit`, value);
    setValue(`entries.${index}.debit`, 0);
  };

  const totalDebit = watchedEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = watchedEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const accountOptions = [
    { value: '', label: 'Select Account' },
    ...accounts
      .filter(account => account.level > 0) // Only include non-header accounts
      .map(account => ({ 
        value: account.id, 
        label: `${account.code} - ${account.name}` 
      })),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Journal Entry' : 'Create New Journal Entry'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Journal Entry Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="date"
                  label="Date"
                  type="date"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="reference"
                  label="Reference"
                  helperText="Invoice number, check number, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="description"
                  label="Description"
                  required
                  helperText="Brief description of this journal entry"
                />
              </Grid>

              {/* Entries Section */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Journal Entry Lines</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addEntry}
                  >
                    Add Line
                  </Button>
                </Box>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="40%">Account</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell width="120px">Debit</TableCell>
                        <TableCell width="120px">Credit</TableCell>
                        <TableCell width="60px">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              name={`entries.${index}.accountId`}
                              label=""
                              type="select"
                              options={accountOptions}
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              name={`entries.${index}.description`}
                              label=""
                              placeholder="Description (optional)"
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              name={`entries.${index}.debit`}
                              label=""
                              type="number"
                              placeholder="0.00"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                handleDebitChange(index, parseFloat(e.target.value) || 0)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              name={`entries.${index}.credit`}
                              label=""
                              type="number"
                              placeholder="0.00"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                handleCreditChange(index, parseFloat(e.target.value) || 0)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => removeEntry(index)}
                              disabled={fields.length <= 2}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Totals Summary */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mt: 2 }} variant="outlined">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Total Debits:</Typography>
                      <Typography variant="h6">${totalDebit.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Total Credits:</Typography>
                      <Typography variant="h6">${totalCredit.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Difference:</Typography>
                      <Typography 
                        variant="h6" 
                        color={isBalanced ? 'success.main' : 'error.main'}
                      >
                        ${Math.abs(totalDebit - totalCredit).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {!isBalanced && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Journal entry is not balanced. Total debits must equal total credits.
                    </Alert>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !isBalanced}
            >
              {loading ? 'Saving...' : (initialData ? 'Update Entry' : 'Create Entry')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default JournalEntryForm;