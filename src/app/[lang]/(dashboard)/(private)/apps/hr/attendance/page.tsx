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
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckInIcon,
  ExitToApp as CheckOutIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import AttendanceForm from '@/modules/hr/components/AttendanceForm';
import { useHRStore } from '@/modules/hr/store/hrStore';
import { useAppSelector } from '@/redux-store';
import { Attendance, AttendanceFormData } from '@/modules/hr/types';
import { DataTableColumn } from '@/types';

const AttendancePage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector((state) => state.auth.user);
  const {
    employees,
    attendance,
    loading,
    error,
    attendanceFilters,
    fetchEmployees,
    fetchAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    checkIn,
    checkOut,
    setAttendanceFilters,
    clearError,
  } = useHRStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingAttendance, setEditingAttendance] = React.useState<Attendance | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = React.useState<Attendance | null>(null);

  React.useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fetchEmployees, fetchAttendance, attendanceFilters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateAttendance = async (data: AttendanceFormData) => {
    try {
      const employee = employees.find(emp => emp.id === data.employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      const employeeName = `${employee.firstName} ${employee.lastName}`;
      await createAttendance(data, employeeName, user?.id || '1', user?.name || 'Current User');
      enqueueSnackbar('Attendance record created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create attendance record', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateAttendance = async (data: AttendanceFormData) => {
    if (!editingAttendance) return;
    
    try {
      await updateAttendance(editingAttendance.id, data);
      enqueueSnackbar('Attendance record updated successfully', { variant: 'success' });
      setEditingAttendance(null);
    } catch (error) {
      enqueueSnackbar('Failed to update attendance record', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteAttendance = async () => {
    if (!attendanceToDelete) return;
    
    try {
      await deleteAttendance(attendanceToDelete.id);
      enqueueSnackbar('Attendance record deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setAttendanceToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete attendance record', { variant: 'error' });
    }
  };

  const handleCheckIn = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      // Find the employee record for the current user
      const employee = employees.find(emp => emp.email === user.email);
      if (!employee) throw new Error('Employee record not found');
      
      await checkIn(employee.id, `${employee.firstName} ${employee.lastName}`);
      enqueueSnackbar('Checked in successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to check in', { variant: 'error' });
    }
  };

  const handleCheckOut = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      // Find the employee record for the current user
      const employee = employees.find(emp => emp.email === user.email);
      if (!employee) throw new Error('Employee record not found');
      
      await checkOut(employee.id);
      enqueueSnackbar('Checked out successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to check out', { variant: 'error' });
    }
  };

  const handleEditAttendance = (record: Attendance) => {
    setEditingAttendance(record);
    setFormOpen(true);
  };

  const openDeleteDialog = (record: Attendance) => {
    setAttendanceToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttendanceFilters({ search: event.target.value });
  };

  const handleEmployeeChange = (event: any) => {
    setAttendanceFilters({ employeeId: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    setAttendanceFilters({ status: event.target.value });
  };

  const handleStartDateChange = (date: any) => {
    setAttendanceFilters({ 
      dateRange: { 
        ...attendanceFilters.dateRange, 
        start: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const handleEndDateChange = (date: any) => {
    setAttendanceFilters({ 
      dateRange: { 
        ...attendanceFilters.dateRange, 
        end: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const handleClearFilters = () => {
    setAttendanceFilters({
      search: '',
      employeeId: 'all',
      status: 'all',
      dateRange: {},
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'half_day': return 'info';
      case 'leave': return 'default';
      default: return 'default';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return timeString;
  };

  const formatWorkHours = (hours: number) => {
    if (hours === 0) return '-';
    return `${hours.toFixed(2)} hrs`;
  };

  const columns: DataTableColumn[] = [
    {
      id: 'date',
      label: 'Date',
      minWidth: 100,
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString(),
    },
    {
      id: 'employeeName',
      label: 'Employee',
      minWidth: 180,
      sortable: true,
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
      id: 'checkIn',
      label: 'Check In',
      minWidth: 120,
      format: (value) => formatTime(value),
    },
    {
      id: 'checkOut',
      label: 'Check Out',
      minWidth: 120,
      format: (value) => formatTime(value),
    },
    {
      id: 'workHours',
      label: 'Work Hours',
      minWidth: 120,
      align: 'right',
      format: (value) => formatWorkHours(value),
    },
    {
      id: 'notes',
      label: 'Notes',
      minWidth: 200,
      format: (value) => value || '-',
    },
  ];

  const hasActiveFilters = 
    attendanceFilters.search || 
    attendanceFilters.employeeId !== 'all' || 
    attendanceFilters.status !== 'all' ||
    attendanceFilters.dateRange.start ||
    attendanceFilters.dateRange.end;

  // Check if current user has already checked in today
  const today = new Date().toISOString().split('T')[0];
  const currentEmployee = user ? employees.find(emp => emp.email === user.email) : null;
  const hasCheckedInToday = currentEmployee && attendance.some(
    record => record.employeeId === currentEmployee.id && 
    record.date === today && 
    record.checkIn
  );
  const hasCheckedOutToday = currentEmployee && attendance.some(
    record => record.employeeId === currentEmployee.id && 
    record.date === today && 
    record.checkOut
  );

  if (loading && attendance.length === 0) {
    return <LoadingSpinner fullScreen message="Loading attendance records..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Attendance Management
          </Typography>
          <Box display="flex" gap={2}>
            {currentEmployee && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CheckInIcon />}
                  onClick={handleCheckIn}
                  disabled={hasCheckedInToday}
                  color="success"
                >
                  Check In
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CheckOutIcon />}
                  onClick={handleCheckOut}
                  disabled={!hasCheckedInToday || hasCheckedOutToday}
                  color="warning"
                >
                  Check Out
                </Button>
              </>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
            >
              Add Record
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search employees..."
                value={attendanceFilters.search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={attendanceFilters.employeeId}
                  onChange={handleEmployeeChange}
                  label="Employee"
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={attendanceFilters.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                  <MenuItem value="half_day">Half Day</MenuItem>
                  <MenuItem value="leave">Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={attendanceFilters.dateRange.start ? dayjs(attendanceFilters.dateRange.start) : null}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'medium',
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={attendanceFilters.dateRange.end ? dayjs(attendanceFilters.dateRange.end) : null}
                  onChange={handleEndDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'medium',
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={1}>
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
              data={attendance}
              loading={loading}
              onEdit={handleEditAttendance}
              onDelete={openDeleteDialog}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={15}
            />
          </CardContent>
        </Card>

        <AttendanceForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingAttendance(null);
          }}
          onSubmit={editingAttendance ? handleUpdateAttendance : handleCreateAttendance}
          initialData={editingAttendance ? {
            employeeId: editingAttendance.employeeId,
            date: editingAttendance.date,
            checkIn: editingAttendance.checkIn || '',
            checkOut: editingAttendance.checkOut || '',
            status: editingAttendance.status,
            notes: editingAttendance.notes,
          } : undefined}
          loading={loading}
          employees={employees}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Attendance Record"
          message={`Are you sure you want to delete this attendance record for ${attendanceToDelete?.employeeName} on ${attendanceToDelete ? new Date(attendanceToDelete.date).toLocaleDateString() : ''}? This action cannot be undone.`}
          onConfirm={handleDeleteAttendance}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setAttendanceToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default AttendancePage;