'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Build,
  Assignment,
  Receipt,
  MoreVert,
  Circle,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/redux-store';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';

type RootState = {
  auth: {
    user: any; // Replace 'any' with your User type if available
  };
};

const DashboardPage: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Mock data
  const stats = {
    totalRevenue: 125000,
    totalCustomers: 1234,
    activeRepairs: 45,
    pendingTasks: 12,
  };

  const revenueData = [
    { name: 'Jan', value: 15000 },
    { name: 'Feb', value: 18000 },
    { name: 'Mar', value: 22000 },
    { name: 'Apr', value: 19000 },
    { name: 'May', value: 25000 },
    { name: 'Jun', value: 26000 },
  ];

  const repairStatusData = [
    { name: 'Completed', value: 45, color: '#4caf50' },
    { name: 'In Progress', value: 30, color: '#ff9800' },
    { name: 'Pending', value: 15, color: '#f44336' },
    { name: 'Awaiting Parts', value: 10, color: '#2196f3' },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New repair request submitted',
      description: 'iPhone 13 Pro - Screen replacement',
      time: '5 minutes ago',
      type: 'repair',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40',
    },
    {
      id: 2,
      title: 'Invoice #INV-001 paid',
      description: 'Payment received: $450.00',
      time: '1 hour ago',
      type: 'payment',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
    },
    {
      id: 3,
      title: 'Quote #QUO-005 approved',
      description: 'Customer approved quote for $1,200',
      time: '2 hours ago',
      type: 'quote',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40',
    },
    {
      id: 4,
      title: 'Task completed',
      description: 'Software update completed for customer device',
      time: '3 hours ago',
      type: 'task',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40',
    },
  ];

  const getStatCards = () => {
    const commonCards = [
      {
        title: 'Total Revenue',
        value: `$${stats.totalRevenue.toLocaleString()}`,
        icon: <TrendingUp />,
        color: 'success.main',
        roles: ['admin', 'staff'],
      },
      {
        title: 'Total Customers',
        value: stats.totalCustomers.toLocaleString(),
        icon: <People />,
        color: 'primary.main',
        roles: ['admin', 'staff'],
      },
      {
        title: 'Active Repairs',
        value: stats.activeRepairs,
        icon: <Build />,
        color: 'warning.main',
        roles: ['admin', 'staff', 'technician'],
      },
      {
        title: 'Pending Tasks',
        value: stats.pendingTasks,
        icon: <Assignment />,
        color: 'info.main',
        roles: ['admin', 'staff', 'technician'],
      },
    ];

    if (user?.role === 'customer') {
      return [
        {
          title: 'My Orders',
          value: '8',
          icon: <Receipt />,
          color: 'primary.main',
          roles: ['customer'],
        },
        {
          title: 'Active Repairs',
          value: '2',
          icon: <Build />,
          color: 'warning.main',
          roles: ['customer'],
        },
        {
          title: 'Completed Repairs',
          value: '15',
          icon: <Build />,
          color: 'success.main',
          roles: ['customer'],
        },
      ];
    }

    return commonCards.filter(card => card.roles.includes(user?.role as any));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'repair':
        return <Build />;
      case 'payment':
        return <Receipt />;
      case 'quote':
        return <TrendingUp />;
      case 'task':
        return <Assignment />;
      default:
        return <Circle />;
    }
  };

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff', 'customer', 'technician']}>
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Here's what's happening with your business today.
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {getStatCards().map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="h6">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: stat.color,
                        color: 'white',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Revenue Chart - Admin/Staff only */}
          {user?.role !== 'customer' && (
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      Revenue Overview
                    </Typography>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="value" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Repair Status Chart */}
          <Grid item xs={12} md={user?.role === 'customer' ? 12 : 4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {user?.role === 'customer' ? 'My Repairs' : 'Repair Status'}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={repairStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {repairStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <ListItem key={activity.id} divider={index < recentActivities.length - 1}>
                      <ListItemIcon>
                        <Avatar src={activity.avatar} sx={{ width: 40, height: 40 }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                            <Chip
                              label={activity.time}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </RoleBasedRoute>
  );
};

export default DashboardPage;