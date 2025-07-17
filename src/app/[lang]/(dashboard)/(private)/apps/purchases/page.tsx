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
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as ReceiveIcon,
  Send as SendIcon,
  CheckCircle as ConfirmIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import PurchaseOrderForm from '@/modules/purchases/components/PurchaseOrderForm';
import PurchaseOrderFilters from '@/modules/purchases/components/PurchaseOrderFilters';
import ReceiveStockDialog from '@/modules/purchases/components/ReceiveStockDialog';
import { usePurchaseOrderStore } from '@/modules/purchases/store/purchaseOrderStore';
import { PurchaseOrder, PurchaseOrderFormData, ReceiveStockData } from '@/modules/purchases/types';
import { DataTableColumn } from '@/types';

const PurchaseOrdersPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    purchaseOrders,
    suppliers,
    loading,
    error,
    filters,
    fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    receiveStock,
    updatePurchaseOrderStatus,
    setFilters,
    clearError,
    fetchSuppliers,
  } = usePurchaseOrderStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingPO, setEditingPO] = React.useState<PurchaseOrder | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [poToDelete, setPOToDelete] = React.useState<PurchaseOrder | null>(null);
  const [receiveStockOpen, setReceiveStockOpen] = React.useState(false);
  const [poToReceive, setPOToReceive] = React.useState<PurchaseOrder | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ [key: string]: HTMLElement | null }>({});

  React.useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
  }, [fetchPurchaseOrders, fetchSuppliers, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreatePO = async (data: PurchaseOrderFormData) => {
    try {
      await createPurchaseOrder(data);
      enqueueSnackbar('Purchase order created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create purchase order', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdatePO = async (data: PurchaseOrderFormData) => {
    if (!editingPO) return;
    
    try {
      await updatePurchaseOrder(editingPO.id, data);
      enqueueSnackbar('Purchase order updated successfully', { variant: 'success' });
      setEditingPO(null);
    } catch (error) {
      enqueueSnackbar('Failed to update purchase order', { variant: 'error' });
      throw error;
    }
  };

  const handleDeletePO = async () => {
    if (!poToDelete) return;
    
    try {
      await deletePurchaseOrder(poToDelete.id);
      enqueueSnackbar('Purchase order deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setPOToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete purchase order', { variant: 'error' });
    }
  };

  const handleReceiveStock = async (data: ReceiveStockData) => {
    try {
      await receiveStock(data);
      enqueueSnackbar('Stock received successfully', { variant: 'success' });
      setPOToReceive(null);
    } catch (error) {
      enqueueSnackbar('Failed to receive stock', { variant: 'error' });
      throw error;
    }
  };

  const handleStatusChange = async (po: PurchaseOrder, newStatus: PurchaseOrder['status']) => {
    try {
      await updatePurchaseOrderStatus(po.id, newStatus);
      enqueueSnackbar(`Purchase order ${newStatus} successfully`, { variant: 'success' });
      closeMenu(po.id);
    } catch (error) {
      enqueueSnackbar(`Failed to ${newStatus} purchase order`, { variant: 'error' });
    }
  };

  const handleViewPO = (po: PurchaseOrder) => {
    router.push(`/purchases/${po.id}`);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    const formData: PurchaseOrderFormData = {
      supplierId: po.supplierId,
      items: po.items,
      taxRate: po.taxRate,
      discountType: po.discountType,
      discountValue: po.discountValue,
      orderDate: po.orderDate,
      expectedDeliveryDate: po.expectedDeliveryDate || '',
      notes: po.notes || '',
      terms: po.terms || '',
      status: po.status === 'sent' ? 'sent' : 'draft',
    };
    setEditingPO(po);
    setFormOpen(true);
  };

  const openDeleteDialog = (po: PurchaseOrder) => {
    setPOToDelete(po);
    setDeleteDialogOpen(true);
  };

  const openReceiveStockDialog = (po: PurchaseOrder) => {
    setPOToReceive(po);
    setReceiveStockOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, poId: string) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [poId]: event.currentTarget });
  };

  const closeMenu = (poId: string) => {
    setMenuAnchor({ ...menuAnchor, [poId]: null });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      supplierId: 'all',
      dateRange: {},
    });
  };

  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'confirmed': return 'warning';
      case 'received': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: DataTableColumn[] = [
    {
      id: 'number',
      label: 'PO Number',
      minWidth: 120,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row.orderDate)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'supplierName',
      label: 'Supplier',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2">{value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.supplierEmail}
          </Typography>
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
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'total',
      label: 'Total',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'expectedDeliveryDate',
      label: 'Expected Delivery',
      minWidth: 140,
      format: (value) => value ? formatDate(value) : '-',
    },
    {
      id: 'receivedDate',
      label: 'Received Date',
      minWidth: 120,
      format: (value) => value ? formatDate(value) : '-',
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      align: 'center',
      format: (value, row) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => openMenu(e, row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor[row.id]}
            open={Boolean(menuAnchor[row.id])}
            onClose={() => closeMenu(row.id)}
          >
            <MenuItem onClick={() => { handleViewPO(row); closeMenu(row.id); }}>
              <ViewIcon sx={{ mr: 1 }} /> View
            </MenuItem>
            <MenuItem onClick={() => { handleEditPO(row); closeMenu(row.id); }}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            {row.status === 'draft' && (
              <MenuItem onClick={() => handleStatusChange(row, 'sent')}>
                <SendIcon sx={{ mr: 1 }} /> Send to Supplier
              </MenuItem>
            )}
            {row.status === 'sent' && (
              <MenuItem onClick={() => handleStatusChange(row, 'confirmed')}>
                <ConfirmIcon sx={{ mr: 1 }} /> Mark Confirmed
              </MenuItem>
            )}
            {(row.status === 'confirmed' || row.status === 'sent') && (
              <MenuItem onClick={() => { openReceiveStockDialog(row); closeMenu(row.id); }}>
                <ReceiveIcon sx={{ mr: 1 }} /> Receive Stock
              </MenuItem>
            )}
            <MenuItem 
              onClick={() => { openDeleteDialog(row); closeMenu(row.id); }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  if (loading && purchaseOrders.length === 0) {
    return <LoadingSpinner fullScreen message="Loading purchase orders..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Purchase Orders
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Create Purchase Order
          </Button>
        </Box>

        <PurchaseOrderFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          suppliers={suppliers}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={purchaseOrders}
              loading={loading}
              onRowClick={handleViewPO}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <PurchaseOrderForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingPO(null);
          }}
          onSubmit={editingPO ? handleUpdatePO : handleCreatePO}
          initialData={editingPO ? {
            supplierId: editingPO.supplierId,
            items: editingPO.items,
            taxRate: editingPO.taxRate,
            discountType: editingPO.discountType,
            discountValue: editingPO.discountValue,
            orderDate: editingPO.orderDate,
            expectedDeliveryDate: editingPO.expectedDeliveryDate || '',
            notes: editingPO.notes || '',
            terms: editingPO.terms || '',
            status: editingPO.status === 'sent' ? 'sent' : 'draft',
          } : undefined}
          loading={loading}
          suppliers={suppliers}
        />

        <ReceiveStockDialog
          open={receiveStockOpen}
          onClose={() => {
            setReceiveStockOpen(false);
            setPOToReceive(null);
          }}
          onConfirm={handleReceiveStock}
          purchaseOrder={poToReceive}
          loading={loading}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Purchase Order"
          message={`Are you sure you want to delete purchase order ${poToDelete?.number}? This action cannot be undone.`}
          onConfirm={handleDeletePO}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setPOToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default PurchaseOrdersPage;