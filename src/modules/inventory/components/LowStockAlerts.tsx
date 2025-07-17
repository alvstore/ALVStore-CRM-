'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Alert,
  Button,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  RemoveShoppingCart as OutOfStockIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { LowStockAlert } from '../types';

interface LowStockAlertsProps {
  alerts: LowStockAlert[];
  onRefresh: () => void;
  loading?: boolean;
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  alerts,
  onRefresh,
  loading = false,
}) => {
  const getSeverityIcon = (severity: LowStockAlert['severity']) => {
    switch (severity) {
      case 'out_of_stock':
        return <OutOfStockIcon color="error" />;
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'low':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon />;
    }
  };

  const getSeverityColor = (severity: LowStockAlert['severity']) => {
    switch (severity) {
      case 'out_of_stock':
        return 'error';
      case 'critical':
        return 'error';
      case 'low':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getSeverityLabel = (severity: LowStockAlert['severity']) => {
    switch (severity) {
      case 'out_of_stock':
        return 'Out of Stock';
      case 'critical':
        return 'Critical';
      case 'low':
        return 'Low Stock';
      default:
        return severity;
    }
  };

  const outOfStockCount = alerts.filter(alert => alert.severity === 'out_of_stock').length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;
  const lowStockCount = alerts.filter(alert => alert.severity === 'low').length;

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Stock Alerts ({alerts.length})
          </Typography>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {alerts.length === 0 ? (
          <Alert severity="success">
            All products are adequately stocked! 🎉
          </Alert>
        ) : (
          <>
            {/* Summary */}
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              {outOfStockCount > 0 && (
                <Chip
                  label={`${outOfStockCount} Out of Stock`}
                  color="error"
                  size="small"
                  icon={<OutOfStockIcon />}
                />
              )}
              {criticalCount > 0 && (
                <Chip
                  label={`${criticalCount} Critical`}
                  color="error"
                  size="small"
                  variant="outlined"
                  icon={<ErrorIcon />}
                />
              )}
              {lowStockCount > 0 && (
                <Chip
                  label={`${lowStockCount} Low Stock`}
                  color="warning"
                  size="small"
                  variant="outlined"
                  icon={<WarningIcon />}
                />
              )}
            </Box>

            {/* Alerts List */}
            <List dense>
              {alerts.slice(0, 10).map((alert) => (
                <ListItem key={alert.id} divider>
                  <ListItemIcon>
                    {getSeverityIcon(alert.severity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {alert.productName}
                        </Typography>
                        <Chip
                          label={getSeverityLabel(alert.severity)}
                          color={getSeverityColor(alert.severity)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {alert.productSku} • Category: {alert.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Current: {alert.currentQuantity} • Minimum: {alert.minStockLevel}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {alerts.length > 10 && (
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Showing 10 of {alerts.length} alerts
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;