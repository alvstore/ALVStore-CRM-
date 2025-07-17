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
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import EmployeeForm from '@/modules/hr/components/EmployeeForm';
import { useHRStore } from '@/modules/hr/store/hrStore';
import { Employee, EmployeeFormData } from '@/modules/hr/types';
import { DataTableColumn } from '@/types';

const EmployeesPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    employees,
    departments,
    loading,
    error,
    filters,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchDepartments,
    setFilters,
    clearError,
  } = useHRStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState<Employee | null>(null);

  React.useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateEmployee = async (data: EmployeeFormData) => {
    try {
      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        department: data.department,
        employeeId: data.employeeId,
        joinDate: data.joinDate,
        status: data.status,
        salary: data.salary,
        salaryType: data.salaryType,
        bankAccount: data.bankAccount,
        bankName: data.bankName,
        taxId: data.taxId,
        address: {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          country: data.country || 'USA',
        },
        emergencyContact: data.emergencyContactName ? {
          name: data.emergencyContactName,
          relationship: data.emergencyContactRelationship || '',
          phone: data.emergencyContactPhone || '',
        } : undefined,
        notes: data.notes,
      };
      
      await createEmployee(employeeData);
      enqueueSnackbar('Employee created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create employee', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateEmployee = async (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    
    try {
      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        department: data.department,
        employeeId: data.employeeId,
        joinDate: data.joinDate,
        status: data.status,
        salary: data.salary,
        salaryType: data.salaryType,
        bankAccount: data.bankAccount,
        bankName: data.bankName,
        taxId: data.taxId,
        address: {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          country: data.country || 'USA',
        },
        emergencyContact: data.emergencyContactName ? {
          name: data.emergencyContactName,
          relationship: data.emergencyContactRelationship || '',
          phone: data.emergencyContactPhone || '',
        } : undefined,
        notes: data.notes,
      };
      
      await updateEmployee(editingEmployee.id, employeeData);
      enqueueSnackbar('Employee updated successfully', { variant: 'success' });
      setEditingEmployee(null);
    } catch (error) {
      enqueueSnackbar('Failed to update employee', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    try {
      await deleteEmployee(employeeToDelete.id);
      enqueueSnackbar('Employee deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete employee', { variant: 'error' });
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    router.push(`/apps/hr/employees/${employee.id}`);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: event.target.value });
  };

  const handleDepartmentChange = (event: any) => {
    setFilters({ department: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    setFilters({ status: event.target.value });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: 'all',
      status: 'all',
      dateRange: {},
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'on_leave': return 'warning';
      case 'terminated': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary: number, salaryType: string) => {
    switch (salaryType) {
      case 'hourly': return `$${salary.toFixed(2)}/hr`;
      case 'monthly': return `$${salary.toFixed(2)}/mo`;
      case 'yearly': return `$${salary.toFixed(2)}/yr`;
      default: return `$${salary.toFixed(2)}`;
    }
  };

  const columns: DataTableColumn[] = [
    {
      id: 'avatar',
      label: '',
      minWidth: 60,
      format: (value, row) => (
        <Avatar
          src={row.avatar}
          sx={{ width: 40, height: 40 }}
        >
          {row.firstName.charAt(0)}
        </Avatar>
      ),
    },
    {
      id: 'name',
      label: 'Name',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {row.firstName} {row.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {row.employeeId}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'position',
      label: 'Position',
      minWidth: 150,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.department}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      minWidth: 200,
      format: (value, row) => (
        <Box>
          <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.email}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.phone}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={value.replace('_', ' ').toUpperCase()}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'salary',
      label: 'Salary',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value, row) => formatSalary(value, row.salaryType),
    },
    {
      id: 'joinDate',
      label: 'Join Date',
      minWidth: 120,
      sortable: true,
      format: (value) => formatDate(value),
    },
  ];

  const hasActiveFilters = filters.search || filters.department !== 'all' || filters.status !== 'all';

  if (loading && employees.length === 0) {
    return <LoadingSpinner fullScreen message="Loading employees..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Employees
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Employee
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search employees..."
                value={filters.search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  onChange={handleDepartmentChange}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={employees}
              loading={loading}
              onRowClick={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={openDeleteDialog}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <EmployeeForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingEmployee(null);
          }}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
          initialData={editingEmployee ? {
            firstName: editingEmployee.firstName,
            lastName: editingEmployee.lastName,
            email: editingEmployee.email,
            phone: editingEmployee.phone,
            position: editingEmployee.position,
            department: editingEmployee.department,
            employeeId: editingEmployee.employeeId,
            joinDate: editingEmployee.joinDate,
            status: editingEmployee.status,
            salary: editingEmployee.salary,
            salaryType: editingEmployee.salaryType,
            bankAccount: editingEmployee.bankAccount,
            bankName: editingEmployee.bankName,
            taxId: editingEmployee.taxId,
            street: editingEmployee.address?.street,
            city: editingEmployee.address?.city,
            state: editingEmployee.address?.state,
            zipCode: editingEmployee.address?.zipCode,
            country: editingEmployee.address?.country,
            emergencyContactName: editingEmployee.emergencyContact?.name,
            emergencyContactRelationship: editingEmployee.emergencyContact?.relationship,
            emergencyContactPhone: editingEmployee.emergencyContact?.phone,
            notes: editingEmployee.notes,
          } : undefined}
          loading={loading}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Employee"
          message={`Are you sure you want to delete ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}? This action cannot be undone.`}
          onConfirm={handleDeleteEmployee}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default EmployeesPage;