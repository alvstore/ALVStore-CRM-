'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Lead, KanbanColumn } from '../types';

interface KanbanViewProps {
  columns: KanbanColumn[];
  onLeadClick: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onMoveToStatus: (leadId: string, newStatus: Lead['status']) => void;
}

interface LeadCardProps {
  lead: Lead;
  onLeadClick: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onMoveToStatus: (leadId: string, newStatus: Lead['status']) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onLeadClick,
  onEditLead,
  onDeleteLead,
  onConvertToClient,
  onMoveToStatus,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEditLead(lead);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDeleteLead(lead);
    handleMenuClose();
  };

  const handleConvert = () => {
    onConvertToClient(lead);
    handleMenuClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '';
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const statusOptions = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 },
        transition: 'box-shadow 0.2s'
      }}
      onClick={() => onLeadClick(lead)}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {lead.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {lead.name}
              </Typography>
              {lead.company && (
                <Typography variant="caption" color="text.secondary">
                  {lead.company}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box mb={1}>
          <Chip
            label={lead.priority}
            color={getPriorityColor(lead.priority)}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={lead.source}
            variant="outlined"
            size="small"
          />
        </Box>

        {lead.estimatedValue && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <MoneyIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {formatCurrency(lead.estimatedValue)}
            </Typography>
          </Box>
        )}

        {lead.assignedToName && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {lead.assignedToName}
            </Typography>
          </Box>
        )}

        {lead.expectedCloseDate && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {formatDate(lead.expectedCloseDate)}
            </Typography>
          </Box>
        )}

        {lead.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
            {lead.tags.slice(0, 2).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {lead.tags.length > 2 && (
              <Chip
                label={`+${lead.tags.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          {lead.status !== 'won' && (
            <MenuItem onClick={handleConvert}>Convert to Client</MenuItem>
          )}
          {statusOptions
            .filter(status => status !== lead.status)
            .map((status) => (
              <MenuItem 
                key={status}
                onClick={() => {
                  onMoveToStatus(lead.id, status as Lead['status']);
                  handleMenuClose();
                }}
              >
                Move to {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

const KanbanView: React.FC<KanbanViewProps> = ({
  columns,
  onLeadClick,
  onEditLead,
  onDeleteLead,
  onConvertToClient,
  onMoveToStatus,
}) => {
  return (
    <Box sx={{ overflowX: 'auto', pb: 2 }}>
      <Grid container spacing={2} sx={{ minWidth: 1200 }}>
        {columns.map((column) => (
          <Grid item xs={12} md={1.7} key={column.id}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: column.color,
                minHeight: 600,
                maxHeight: 600,
                overflow: 'auto'
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  {column.title}
                </Typography>
                <Chip 
                  label={column.leads.length} 
                  size="small" 
                  color="primary"
                />
              </Box>
              
              <Box>
                {column.leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onLeadClick={onLeadClick}
                    onEditLead={onEditLead}
                    onDeleteLead={onDeleteLead}
                    onConvertToClient={onConvertToClient}
                    onMoveToStatus={onMoveToStatus}
                  />
                ))}
                
                {column.leads.length === 0 && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="body2">
                      No leads in this stage
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KanbanView;