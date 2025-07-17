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
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  Assignment as TaskIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import { useTicketStore } from '@/modules/support/store/ticketStore';

const SupportDashboardPage: React.FC = () => {
  const router = useRouter();
  const {
    tickets,
    fetchTickets,
  } = useTicketStore();

  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const supportModules = [
    {
      title: 'Support Tickets',
      description: 'Manage customer support tickets',
      icon: <TicketIcon fontSize="large" color="primary" />,
      path: '/support/tickets',
      count: tickets.length,
    },
    {
      title: 'Tasks',
      description: 'Manage and track tasks',
      icon: <TaskIcon fontSize="large" color="secondary" />,
      path: '/tasks',
      count: 0,
    },
    {
      title: 'Knowledge Base',
      description: 'Access articles and solutions',
      icon: <ChatIcon fontSize="large" color="info" />,
      path: '/support/knowledge-base',
      count: 0,
    },
    {
      title: 'Support Settings',
      description: 'Configure support preferences',
      icon: <SettingsIcon fontSize="large" color="success" />,
      path: '/support/settings',
      count: 0,
    },
  ];

  // Calculate summary statistics
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const highPriorityTickets = tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length;

  // Recent tickets
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff', 'technician']}>
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Support Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ErrorIcon color="error" fontSize="large" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {openTickets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Open Tickets
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <HourglassEmptyIcon color="warning" fontSize="large" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {inProgressTickets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <CheckCircleIcon color="success" fontSize="large" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {resolvedTickets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resolved Tickets
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PendingIcon color="error" fontSize="large" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {highPriorityTickets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Priority
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Support Modules */}
        <Typography variant="h5" gutterBottom>
          Support Modules
        </Typography>
        <Grid container spacing={3} mb={4}>
          {supportModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea 
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  onClick={() => router.push(module.path)}
                >
                  <CardContent sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      {module.icon}
                      {module.count !== undefined && module.count > 0 && (
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

        {/* Recent Tickets */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Tickets
                </Typography>
                <List>
                  {recentTickets.length > 0 ? (
                    recentTickets.map((ticket, index) => (
                      <React.Fragment key={ticket.id}>
                        <ListItem 
                          button 
                          onClick={() => router.push(`/support/tickets/${ticket.id}`)}
                        >
                          <ListItemText
                            primary={ticket.subject}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {ticket.clientName}
                                </Typography>
                                {" — "}{new Date(ticket.createdAt).toLocaleDateString()}
                              </React.Fragment>
                            }
                          />
                          <Chip
                            label={ticket.status.replace('_', ' ').toUpperCase()}
                            color={
                              ticket.status === 'open' ? 'info' :
                              ticket.status === 'in_progress' ? 'warning' :
                              ticket.status === 'resolved' ? 'success' : 'default'
                            }
                            size="small"
                          />
                        </ListItem>
                        {index < recentTickets.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No tickets found"
                        secondary="Create a new ticket to get started"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ticket Distribution
                </Typography>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="body1" color="text.secondary">
                    Ticket distribution chart will be displayed here
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

export default SupportDashboardPage;