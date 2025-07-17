'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import SalaryComponentForm from '@/modules/payroll/components/SalaryComponentForm';
import { usePayrollStore } from '@/modules/payroll/store/payrollStore';
import { SalaryComponent } from '@/modules/payroll/types';

const PayrollSettingsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    salaryComponents,
    loading,
    error,
    fetchSalaryComponents,
    createSalaryComponent,
    updateSalaryComponent,
    deleteSalaryComponent,
    clearError,
  } = usePayrollStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingComponent, setEditingComponent] = React.useState<SalaryComponent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [componentToDelete, setComponentToDelete] = React.useState<SalaryComponent | null>(null);

  React.useEffect(() => {
    fetchSalaryComponents();
  }, [fetchSalaryComponents]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateComponent = async (data: Omit<SalaryComponent, 'id'>) => {
    try {
      await createSalaryComponent(data);
      enqueueSnackbar('Salary component created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create salary component', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateComponent = async (data: Omit<SalaryComponent, 'id'>) => {
    if (!editingComponent) return;
    
    try {
      await updateSalaryComponent(editingComponent.id, data);
      enqueueSnackbar('Salary component updated successfully', { variant: 'success' });
      setEditingComponent(null);
    } catch (error) {
      enqueueSnackbar('Failed to update salary component', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteComponent = async () => {
    if (!componentToDelete) return;
    
    try {
      await deleteSalaryComponent(componentToDelete.id);
      enqueueSnackbar('Salary component deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setComponentToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete salary component', { variant: 'error' });
    }
  };

  const handleEditComponent = (component: SalaryComponent) => {
    setEditingComponent(component);
    setFormOpen(true);
  };

  const openDeleteDialog = (component: SalaryComponent) => {
    setComponentToDelete(component);
    setDeleteDialogOpen(true);
  };

  const earningComponents = salaryComponents.filter(comp => comp.type === 'earning');
  const deductionComponents = salaryComponents.filter(comp => comp.type === 'deduction');

  if (loading && salaryComponents.length === 0) {
    return <LoadingSpinner fullScreen message="Loading payroll settings..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Payroll Settings
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Salary Component
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Earnings
                  </Typography>
                  <Chip 
                    label={earningComponents.length} 
                    color="primary" 
                    size="small" 
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Taxable</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {earningComponents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body2" color="text.secondary" py={2}>
                              No earning components defined
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        earningComponents.map((component) => (
                          <TableRow key={component.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {component.name}
                              </Typography>
                              {component.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {component.description}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {component.calculationType === 'fixed' ? 'Fixed' : 'Percentage'}
                            </TableCell>
                            <TableCell>
                              {component.calculationType === 'fixed' 
                                ? `$${component.value.toFixed(2)}` 
                                : `${component.value}%`}
                            </TableCell>
                            <TableCell>
                              {component.taxable ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleEditComponent(component)}
                                disabled={component.isDefault}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => openDeleteDialog(component)}
                                disabled={component.isDefault}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Deductions
                  </Typography>
                  <Chip 
                    label={deductionComponents.length} 
                    color="error" 
                    size="small" 
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Taxable</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deductionComponents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body2" color="text.secondary" py={2}>
                              No deduction components defined
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        deductionComponents.map((component) => (
                          <TableRow key={component.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {component.name}
                              </Typography>
                              {component.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {component.description}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {component.calculationType === 'fixed' ? 'Fixed' : 'Percentage'}
                            </TableCell>
                            <TableCell>
                              {component.calculationType === 'fixed' 
                                ? `$${component.value.toFixed(2)}` 
                                : `${component.value}%`}
                            </TableCell>
                            <TableCell>
                              {component.taxable ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleEditComponent(component)}
                                disabled={component.isDefault}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => openDeleteDialog(component)}
                                disabled={component.isDefault}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <SalaryComponentForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingComponent(null);
          }}
          onSubmit={editingComponent ? handleUpdateComponent : handleCreateComponent}
          initialData={editingComponent || undefined}
          loading={loading}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Salary Component"
          message={`Are you sure you want to delete the "${componentToDelete?.name}" component? This action cannot be undone.`}
          onConfirm={handleDeleteComponent}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setComponentToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default PayrollSettingsPage;