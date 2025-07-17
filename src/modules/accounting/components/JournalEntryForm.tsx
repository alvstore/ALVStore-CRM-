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
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
      reference: '',
      description: '',
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset
  } = methods;

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
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register('date')}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Reference"
                  helperText="Invoice number, check number, etc."
                  {...register('reference')}
                  error={!!errors.reference}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  required
                  helperText={errors.description?.message || "Brief description of this journal entry"}
                  {...register('description')}
                  error={!!errors.description}
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
                            <TextField
                              select
                              fullWidth
                              size="small"
                              {...register(`entries.${index}.accountId`)}
                              error={!!errors.entries?.[index]?.accountId}
                              helperText={errors.entries?.[index]?.accountId?.message}
                              required
                            >
                              {accountOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Description (optional)"
                              {...register(`entries.${index}.description`)}
                              error={!!errors.entries?.[index]?.description}
                              helperText={errors.entries?.[index]?.description?.message}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              placeholder="0.00"
                              {...register(`entries.${index}.debit`, {
                                valueAsNumber: true,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
                                  handleDebitChange(index, parseFloat(e.target.value) || 0)
                              })}
                              error={!!errors.entries?.[index]?.debit}
                              helperText={errors.entries?.[index]?.debit?.message}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              placeholder="0.00"
                              {...register(`entries.${index}.credit`, {
                                valueAsNumber: true,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
                                  handleCreditChange(index, parseFloat(e.target.value) || 0)
                              })}
                              error={!!errors.entries?.[index]?.credit}
                              helperText={errors.entries?.[index]?.credit?.message}
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