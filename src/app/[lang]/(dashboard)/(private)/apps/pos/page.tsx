'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  QrCode as BarcodeIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  TrendingUp as SummaryIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import ProductSearch from '@/modules/pos/components/ProductSearch';
import Cart from '@/modules/pos/components/Cart';
import PaymentDialog from '@/modules/pos/components/PaymentDialog';
import BarcodeScanner from '@/modules/pos/components/BarcodeScanner';
import CustomerDialog from '@/modules/pos/components/CustomerDialog';
import NotesDialog from '@/modules/pos/components/NotesDialog';
import ReceiptDialog from '@/modules/pos/components/ReceiptDialog';
import SalesSummary from '@/modules/pos/components/SalesSummary';
import { usePOSStore } from '@/modules/pos/store/posStore';
import { useClientStore } from '@/modules/clients/store/clientStore';
import { Sale } from '@/modules/pos/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pos-tabpanel-${index}`}
      aria-labelledby={`pos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const POSPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    products,
    filteredProducts,
    categories,
    cart,
    sales,
    selectedSale,
    dailySummary,
    loading,
    error,
    searchTerm,
    selectedCategory,
    fetchProducts,
    searchProducts,
    fetchCategories,
    addToCart,
    updateCartItemQuantity,
    updateCartItemDiscount,
    removeFromCart,
    clearCart,
    setCustomer,
    setNotes,
    createSale,
    fetchSales,
    fetchSaleById,
    fetchDailySummary,
    processBarcode,
  } = usePOSStore();

  const {
    clients,
    fetchClients,
  } = useClientStore();

  const [tabValue, setTabValue] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchClients();
    fetchDailySummary();
  }, [fetchProducts, fetchCategories, fetchClients, fetchDailySummary]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Fetch data based on selected tab
    if (newValue === 1) { // Sales History tab
      fetchSales();
    } else if (newValue === 2) { // Summary tab
      fetchDailySummary();
    }
  };

  const handleProductSearch = (term: string, category?: string) => {
    searchProducts(term, category);
  };

  const handleProductSelect = (product: any) => {
    try {
      addToCart(product);
      enqueueSnackbar(`Added ${product.name} to cart`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to add product to cart', { variant: 'error' });
    }
  };

  const handleScanBarcode = () => {
    setBarcodeScannerOpen(true);
  };

  const handleBarcodeScanned = async (barcode: string) => {
    try {
      await processBarcode(barcode);
      enqueueSnackbar('Product added to cart', { variant: 'success' });
    } catch (error) {
      throw error; // Let the BarcodeScanner component handle the error
    }
  };

  const handleCheckout = () => {
    setPaymentDialogOpen(true);
  };

  const handleProcessPayment = async (method: string, details: any) => {
    try {
      const sale = await createSale(method, details);
      setCurrentSale(sale);
      setPaymentDialogOpen(false);
      setReceiptDialogOpen(true);
      enqueueSnackbar('Sale completed successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to process payment', { variant: 'error' });
    }
  };

  const handleSelectCustomer = () => {
    setCustomerDialogOpen(true);
  };

  const handleCustomerSelected = (customer: any) => {
    setCustomer(customer);
    enqueueSnackbar(`Customer ${customer.name} selected`, { variant: 'success' });
  };

  const handleAddNotes = () => {
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = (notes: string) => {
    setNotes(notes);
  };

  const handlePrintReceipt = () => {
    // In a real app, this would use a library like react-to-print
    window.print();
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate a PDF or other file format
    enqueueSnackbar('Receipt download functionality would be implemented here', { variant: 'info' });
  };

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Point of Sale (POS)
          </Typography>
          <Button
            variant="outlined"
            startIcon={<BarcodeIcon />}
            onClick={handleScanBarcode}
          >
            Scan Barcode
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<CartIcon />} label="POS" />
            <Tab icon={<ReceiptIcon />} label="Sales History" />
            <Tab icon={<SummaryIcon />} label="Daily Summary" />
          </Tabs>
        </Box>

        {/* POS Screen */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <ProductSearch
                products={filteredProducts}
                categories={categories}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onSearch={handleProductSearch}
                onSelectProduct={handleProductSelect}
                onScanBarcode={handleScanBarcode}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Cart
                cart={cart}
                onUpdateQuantity={updateCartItemQuantity}
                onUpdateDiscount={updateCartItemDiscount}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                onCheckout={handleCheckout}
                onSelectCustomer={handleSelectCustomer}
                onAddNotes={handleAddNotes}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Sales History */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Recent Sales
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Sales history and detailed reports would be displayed here. You can view, filter, and export sales data.
          </Alert>
        </TabPanel>

        {/* Daily Summary */}
        <TabPanel value={tabValue} index={2}>
          {dailySummary ? (
            <SalesSummary summary={dailySummary} />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <Typography variant="body1" color="text.secondary">
                Loading daily summary...
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Payment Dialog */}
        <PaymentDialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          onProcessPayment={handleProcessPayment}
          cart={cart}
          loading={loading}
        />

        {/* Barcode Scanner Dialog */}
        <BarcodeScanner
          open={barcodeScannerOpen}
          onClose={() => setBarcodeScannerOpen(false)}
          onScan={handleBarcodeScanned}
          loading={loading}
        />

        {/* Customer Selection Dialog */}
        <CustomerDialog
          open={customerDialogOpen}
          onClose={() => setCustomerDialogOpen(false)}
          onSelectCustomer={handleCustomerSelected}
          customers={clients}
          loading={loading}
        />

        {/* Notes Dialog */}
        <NotesDialog
          open={notesDialogOpen}
          onClose={() => setNotesDialogOpen(false)}
          onSave={handleSaveNotes}
          initialNotes={cart.notes}
          loading={loading}
        />

        {/* Receipt Dialog */}
        <ReceiptDialog
          open={receiptDialogOpen}
          onClose={() => setReceiptDialogOpen(false)}
          sale={currentSale}
          onPrint={handlePrintReceipt}
          onDownload={handleDownloadReceipt}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default POSPage;