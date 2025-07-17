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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import DataTable from '@/views/react-table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import LeaveRequestForm from '@/modules/hr/components/LeaveRequestForm';
import { useHRStore } from '@/modules/hr/store/hrStore';
import { useAppSelector } from '@/redux-store';
import { LeaveRequest, LeaveRequestFormData, LeaveBalance } from '@/modules/hr/types';


const LeaveRequestsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector((state) => state.auth.user);
  const {
    employees,
    leaveRequests,
    leaveBalance,
    loading,
    error,
    leaveFilters,
    fetchEmployees,
    fetchLeaveRequests,
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    fetchLeaveBalance,
    setLeaveFilters,
    clearError,
  } = useHRStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [requestToReject, setRequestToReject] = React.useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [currentEmployeeId, setCurrentEmployeeId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
    
    // Find current user's employee record
    if (user) {
      const employee = employees.find(emp => emp.email === user.email);
      if (employee) {
        setCurrentEmployeeId(employee.id);
        fetchLeaveBalance(employee.id);
      }
    }
  }, [fetchEmployees, fetchLeaveRequests, fetchLeaveBalance, user, employees]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateLeaveRequest = async (data: LeaveRequestFormData) => {
    try {
      const employee = employees.find(emp => emp.id === data.employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      const employeeName = `${employee.firstName} ${employee.lastName}`;
      await createLeaveRequest(data, employeeName);
      enqueueSnackbar('Leave request submitted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to submit leave request', { variant: 'error' });
      throw error;
    }
  };

  const handleApproveRequest = async (request: LeaveRequest) => {
    try {
      if (!user) throw new Error('User not authenticated');
      await approveLeaveRequest(request.id, user.id, user.name);
      enqueueSnackbar('Leave request approved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to approve leave request', { variant: 'error' });
    }
  };

  const openRejectDialog = (request: LeaveRequest) => {
    setRequestToReject(request);
    setRejectDialogOpen(true);
    setRejectionReason('');
  };

  const handleRejectRequest = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      if (!requestToReject) return;
      
      await rejectLeaveRequest(requestToReject.id, user.id, user.name, rejectionReason);
      enqueueSnackbar('Leave request rejected', { variant: 'info' });
      setRejectDialogOpen(false);
      setRequestToReject(null);
    } catch (error) {
      enqueueSnackbar('Failed to reject leave request', { variant: 'error' });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLeaveFilters({ search: event.target.value });
  };

  const handleEmployeeChange = (event: any) => {
    setLeaveFilters({ employeeId: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    setLeaveFilters({ status: event.target.value });
  };

  const handleLeaveTypeChange = (event: any) => {
    setLeaveFilters({ leaveType: event.target.value });
  };

  const handleStartDateChange = (date: any) => {
    setLeaveFilters({ 
      dateRange: { 
        ...leaveFilters.dateRange, 
        start: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const handleEndDateChange = (date: any) => {
    setLeaveFilters({ 
      dateRange: { 
        ...leaveFilters.dateRange, 
        end: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const handleClearFilters = () => {
    setLeaveFilters({
      search: '',
      employeeId: 'all',
      status: 'all',
      leaveType: 'all',
      dateRange: {},
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'primary';
      case 'sick': return 'error';
      case 'personal': return 'info';
      case 'maternity': return 'secondary';
      case 'paternity': return 'secondary';
      case 'unpaid': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const columns: ColumnDef<LeaveRequest>[] = [
    {
      id: 'employeeName',
      label: 'Employee',
      minWidth: 180,
      sortable: true,
    },
    {
      id: 'leaveType',
      label: 'Leave Type',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={value.replace('_', ' ').toUpperCase()}
          color={getLeaveTypeColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      minWidth: 180,
      format: (value, row) => formatDateRange(row.startDate, row.endDate),
    },
    {
      id: 'totalDays',
      label: 'Days',
      minWidth: 80,
      align: 'center',
      sortable: true,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={value.toUpperCase()}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'reason',
      label: 'Reason',
      minWidth: 200,
      format: (value) => value,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'center',
      format: (value, row) => (
        row.status === 'pending' ? (
          <Box>
            <IconButton
              color="success"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleApproveRequest(row);
              }}
              title="Approve"
            >
              <ApproveIcon />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openRejectDialog(row);
              }}
              title="Reject"
            >
              <RejectIcon />
            </IconButton>
          </Box>
        ) : null
      ),
    },
  ];

  const hasActiveFilters = 
    leaveFilters.search || 
    leaveFilters.employeeId !== 'all' || 
    leaveFilters.status !== 'all' ||
    leaveFilters.leaveType !== 'all' ||
    leaveFilters.dateRange.start ||
    leaveFilters.dateRange.end;

  if (loading && leaveRequests.length === 0) {
    return <LoadingSpinner fullScreen message="Loading leave requests..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Leave Requests
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            New Leave Request
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={leaveFilters.search}
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
                  value={leaveFilters.employeeId}
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
                  value={leaveFilters.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={leaveFilters.leaveType}
                  onChange={handleLeaveTypeChange}
                  label="Leave Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                  <MenuItem value="sick">Sick</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="maternity">Maternity</MenuItem>
                  <MenuItem value="paternity">Paternity</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From"
                  value={leaveFilters.dateRange.start ? dayjs(leaveFilters.dateRange.start) : null}
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
              data={leaveRequests}
              title="Leave Requests"
              enablePagination={true}
              pageSize={15}
              searchPlaceholder="Search leave requests..."
              onRowClick={(row) => {
                // Handle row click if needed
                console.log('Row clicked:', row);
              }}
            />
          </CardContent>
        </Card>

        <LeaveRequestForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreateLeaveRequest}
          loading={loading}
          employees={employees}
          leaveBalance={leaveBalance}
          currentEmployeeId={currentEmployeeId}
        />

        <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
          <DialogTitle>Reject Leave Request</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Rejection"
              fullWidth
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleRejectRequest} 
              color="error" 
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RoleBasedRoute>
  );
};

export default LeaveRequestsPage;