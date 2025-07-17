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
  Avatar,
  Grid,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as StockInIcon,
  TrendingDown as StockOutIcon,
  Tune as AdjustIcon,
  Warning as WarningIcon,
  QrCode as BarcodeIcon,
  TrendingUp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import ProductForm from '@/modules/inventory/components/ProductForm';
import ProductFilters from '@/modules/inventory/components/ProductFilters';
import StockMovementForm from '@/modules/inventory/components/StockMovementForm';
import LowStockAlerts from '@/modules/inventory/components/LowStockAlerts';
import { useInventoryStore } from '@/modules/inventory/store/inventoryStore';
import { Product, ProductFormData, StockMovementFormData } from '@/modules/inventory/types';
import { DataTableColumn } from '@/types';

const InventoryPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    products,
    categories,
    lowStockAlerts,
    loading,
    error,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createStockMovement,
    fetchCategories,
    fetchLowStockAlerts,
    setFilters,
    clearError,
    generateBarcode,
    generateSku,
  } = useInventoryStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  const [stockMovementOpen, setStockMovementOpen] = React.useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = React.useState<Product | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ [key: string]: HTMLElement | null }>({});

  React.useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchLowStockAlerts();
  }, [fetchProducts, fetchCategories, fetchLowStockAlerts, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProduct(data);
      enqueueSnackbar('Product added successfully', { variant: 'success' });
      fetchLowStockAlerts(); // Refresh alerts
    } catch (error) {
      enqueueSnackbar('Failed to add product', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;
    
    try {
      await updateProduct(editingProduct.id, data);
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      setEditingProduct(null);
      fetchLowStockAlerts(); // Refresh alerts
    } catch (error) {
      enqueueSnackbar('Failed to update product', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete.id);
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchLowStockAlerts(); // Refresh alerts
    } catch (error) {
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    }
  };

  const handleStockMovement = async (data: StockMovementFormData) => {
    try {
      await createStockMovement(data);
      enqueueSnackbar('Stock movement recorded successfully', { variant: 'success' });
      setSelectedProductForStock(null);
      fetchLowStockAlerts(); // Refresh alerts
    } catch (error) {
      enqueueSnackbar('Failed to record stock movement', { variant: 'error' });
      throw error;
    }
  };

  const handleViewProduct = (product: Product) => {
    router.push(`/inventory/${product.id}`);
  };

  const handleEditProduct = (product: Product) => {
    const formData: ProductFormData = {
      sku: product.sku,
      barcode: product.barcode || '',
      name: product.name,
      description: product.description || '',
      category: product.category,
      brand: product.brand || '',
      unit: product.unit,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      quantity: product.quantity,
      minStockLevel: product.minStockLevel,
      maxStockLevel: product.maxStockLevel,
      location: product.location || '',
      supplier: product.supplier || '',
      status: product.status,
      tags: product.tags,
    };
    setEditingProduct(product);
    setFormOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const openStockMovement = (product: Product, type?: 'in' | 'out' | 'adjustment') => {
    setSelectedProductForStock(product);
    setStockMovementOpen(true);
    closeMenu(product.id);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, productId: string) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [productId]: event.currentTarget });
  };

  const closeMenu = (productId: string) => {
    setMenuAnchor({ ...menuAnchor, [productId]: null });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      lowStock: false,
      tags: [],
      priceRange: {},
    });
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'discontinued': return 'error';
      default: return 'default';
    }
  };

  const getStockStatusColor = (product: Product) => {
    if (product.quantity === 0) return 'error';
    if (product.quantity <= product.minStockLevel) return 'warning';
    return 'success';
  };

  const getStockStatusLabel = (product: Product) => {
    if (product.quantity === 0) return 'Out of Stock';
    if (product.quantity <= product.minStockLevel) return 'Low Stock';
    return 'In Stock';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: DataTableColumn[] = [
    {
      id: 'image',
      label: '',
      minWidth: 60,
      format: (value, row) => (
        <Avatar
          src={row.imageUrl}
          sx={{ width: 40, height: 40 }}
          variant="rounded"
        >
          {row.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      id: 'name',
      label: 'Product',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SKU: {row.sku}
          </Typography>
          {row.barcode && (
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <BarcodeIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {row.barcode}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 120,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          {row.brand && (
            <Typography variant="caption" color="text.secondary">
              {row.brand}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'quantity',
      label: 'Stock',
      minWidth: 120,
      align: 'center',
      sortable: true,
      format: (value, row) => (
        <Box textAlign="center">
          <Typography variant="subtitle2" fontWeight="medium">
            {value} {row.unit}
          </Typography>
          <Chip
            label={getStockStatusLabel(row)}
            color={getStockStatusColor(row)}
            size="small"
            icon={value <= row.minStockLevel ? <WarningIcon /> : undefined}
          />
        </Box>
      ),
    },
    {
      id: 'costPrice',
      label: 'Cost',
      minWidth: 100,
      align: 'right',
      sortable: true,
      format: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'sellingPrice',
      label: 'Price',
      minWidth: 100,
      align: 'right',
      sortable: true,
      format: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
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
      id: 'location',
      label: 'Location',
      minWidth: 100,
      format: (value) => value || '-',
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
            <MenuItem onClick={() => { handleViewProduct(row); closeMenu(row.id); }}>
              <ViewIcon sx={{ mr: 1 }} /> View
            </MenuItem>
            <MenuItem onClick={() => { handleEditProduct(row); closeMenu(row.id); }}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => openStockMovement(row, 'in')}>
              <StockInIcon sx={{ mr: 1 }} /> Stock In
            </MenuItem>
            <MenuItem onClick={() => openStockMovement(row, 'out')}>
              <StockOutIcon sx={{ mr: 1 }} /> Stock Out
            </MenuItem>
            <MenuItem onClick={() => openStockMovement(row, 'adjustment')}>
              <AdjustIcon sx={{ mr: 1 }} /> Adjust Stock
            </MenuItem>
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

  if (loading && products.length === 0) {
    return <LoadingSpinner fullScreen message="Loading inventory..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Inventory Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<TrendingUp />}
              onClick={() => setStockMovementOpen(true)}
            >
              Stock Movement
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Low Stock Alerts */}
        {lowStockAlerts.length > 0 && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={4}>
              <LowStockAlerts
                alerts={lowStockAlerts}
                onRefresh={fetchLowStockAlerts}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              {/* Placeholder for inventory stats or charts */}
              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>
                  Inventory Overview
                </Typography>
                <Typography variant="body2">
                  Total Products: {products.length} • 
                  Low Stock Items: {lowStockAlerts.filter(a => a.severity === 'low').length} • 
                  Out of Stock: {lowStockAlerts.filter(a => a.severity === 'out_of_stock').length}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        )}

        <ProductFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          categories={categories}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={products}
              loading={loading}
              onRowClick={handleViewProduct}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <ProductForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          initialData={editingProduct ? {
            sku: editingProduct.sku,
            barcode: editingProduct.barcode || '',
            name: editingProduct.name,
            description: editingProduct.description || '',
            category: editingProduct.category,
            brand: editingProduct.brand || '',
            unit: editingProduct.unit,
            costPrice: editingProduct.costPrice,
            sellingPrice: editingProduct.sellingPrice,
            quantity: editingProduct.quantity,
            minStockLevel: editingProduct.minStockLevel,
            maxStockLevel: editingProduct.maxStockLevel,
            location: editingProduct.location || '',
            supplier: editingProduct.supplier || '',
            status: editingProduct.status,
            tags: editingProduct.tags,
          } : undefined}
          loading={loading}
          categories={categories}
          onGenerateBarcode={generateBarcode}
          onGenerateSku={generateSku}
        />

        <StockMovementForm
          open={stockMovementOpen}
          onClose={() => {
            setStockMovementOpen(false);
            setSelectedProductForStock(null);
          }}
          onSubmit={handleStockMovement}
          loading={loading}
          products={products}
          selectedProduct={selectedProductForStock}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone and will remove all stock movement history.`}
          onConfirm={handleDeleteProduct}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default InventoryPage;