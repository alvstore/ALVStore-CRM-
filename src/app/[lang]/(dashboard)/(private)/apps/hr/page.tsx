'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccessTime as AttendanceIcon,
  EventNote as LeaveIcon,
  AccountBalance as PayrollIcon,
  Receipt as PayslipIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  EventNote as EventNoteIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  AssignmentInd as AssignmentIndIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import { useHRStore } from '@/modules/hr/store/hrStore';
import { usePayrollStore } from '@/modules/payroll/store/payrollStore';

type HRDashboardPageProps = {
  params: {
    lang: string;
  };
};

const HRDashboardPage = ({ params }: HRDashboardPageProps) => {
  const { lang } = React.use<{ lang: string }>(Promise.resolve(params));
  const router = useRouter();
  const {
    employees,
    attendance,
    leaveRequests,
    fetchEmployees,
    fetchAttendance,
    fetchLeaveRequests,
  } = useHRStore();
  
  const {
    payrolls,
    fetchPayrolls,
  } = usePayrollStore();

  React.useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    fetchLeaveRequests();
    fetchPayrolls();
  }, [fetchEmployees, fetchAttendance, fetchLeaveRequests, fetchPayrolls]);

  const hrModules = [
    {
      title: 'Employees',
      description: 'Manage employee records and information',
      icon: <PeopleIcon fontSize="large" color="primary" />,
      path: '/apps/hr/employees',
      count: employees.length,
    },
    {
      title: 'Attendance',
      description: 'Track daily attendance and work hours',
      icon: <AccessTimeIcon fontSize="large" color="secondary" />,
      path: '/apps/hr/attendance',
      count: attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    },
    {
      title: 'Leave Management',
      description: 'Handle leave requests and balances',
      icon: <EventNoteIcon fontSize="large" color="info" />,
      path: '/apps/hr/leave-requests',
      count: leaveRequests.filter(lr => lr.status === 'pending').length,
    },
    {
      title: 'Payroll',
      description: 'Process payroll and generate payslips',
      icon: <PaymentIcon fontSize="large" color="success" />,
      path: '/apps/payroll',
      count: payrolls.length,
    },
  ];

  // Calculate summary statistics
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'on_leave').length;
  const pendingLeaveRequests = leaveRequests.filter(lr => lr.status === 'pending').length;
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentToday = employees.length - presentToday;

  // Recent activities - combine recent attendance and leave requests
  const recentActivities = [
    ...attendance.slice(0, 5).map(a => ({
      id: a.id,
      type: 'attendance',
      title: `${a.employeeName} ${a.status === 'present' ? 'checked in' : a.status === 'absent' ? 'is absent' : a.status}`,
      date: a.date,
      time: a.checkIn || '',
      avatar: '',
    })),
    ...leaveRequests.slice(0, 5).map(lr => ({
      id: lr.id,
      type: 'leave',
      title: `${lr.employeeName} requested ${lr.leaveType} leave`,
      date: lr.startDate,
      time: new Date(lr.createdAt).toLocaleTimeString(),
      avatar: '',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const quickLinks = [
    {
      title: 'Employees',
      description: 'Manage employee records and information',
      icon: <PeopleIcon />,
      href: `/${lang}/apps/hr/employees`,
      count: 24,
      color: 'primary'
    },
    {
      title: 'Attendance',
      description: 'Track employee attendance and time logs',
      icon: <AttendanceIcon />,
      href: `/${lang}/apps/hr/attendance`,
      count: 45,
      color: 'success'
    },
    {
      title: 'Leave Requests',
      description: 'Manage employee leave applications',
      icon: <LeaveIcon />,
      href: `/${lang}/apps/hr/leave-requests`,
      count: 8,
      color: 'warning'
    },
    {
      title: 'Payroll',
      description: 'Process and manage employee salaries',
      icon: <PayrollIcon />,
      href: `/${lang}/apps/hr/payroll`,
      count: 1,
      color: 'info'
    },
    {
      title: 'Payslips',
      description: 'View and manage employee payslips',
      icon: <PayslipIcon />,
      href: `/${lang}/apps/hr/payslips`,
      count: 0,
      color: 'secondary'
    }
  ];

  return (
    <RoleBasedRoute requiredRoles={['admin', 'staff']}>
      <Box>
        <Box className="space-y-6">
          <Box className="flex flex-col gap-2">
            <Typography variant="h4">HR Dashboard</Typography>
            <Typography color="text.secondary">
              Overview of your human resources
            </Typography>
          </Box>

          {/* Quick Links */}
          <Grid container spacing={6}>
            {quickLinks.map((link, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card 
                  component={Link} 
                  href={link.href}
                  className="h-full transition-transform hover:shadow-md hover:-translate-y-1"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      borderColor: 'primary.main',
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <EventNoteIcon color="warning" fontSize="large" />
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {pendingLeaveRequests}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Leave Requests
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

        {/* HR Modules */}
        <Typography variant="h5" gutterBottom>
          HR Modules
        </Typography>
        <Grid container spacing={3} mb={4}>
          {hrModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea 
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  onClick={() => router.push(module.path)}
                >
                  <CardContent sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      {module.icon}
                      {module.count !== undefined && (
                        <Chip 
                          label={module.count} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activities */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            {activity.type === 'attendance' ? <AccessTimeIcon /> : <EventNoteIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {new Date(activity.date).toLocaleDateString()}
                              </Typography>
                              {" — "}{activity.time}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Department Distribution
                </Typography>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="body1" color="text.secondary">
                    Department chart will be displayed here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </RoleBasedRoute>
  );
};

export default HRDashboardPage;