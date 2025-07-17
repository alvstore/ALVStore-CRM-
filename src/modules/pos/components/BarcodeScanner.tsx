import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import { QrCode as QrCodeIcon, Send as SendIcon } from '@mui/icons-material';

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => Promise<void>;
  loading?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  open,
  onClose,
  onScan,
  loading = false,
}) => {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus the input field when the dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleScan = async () => {
    if (!barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }
    
    setError('');
    try {
      await onScan(barcode);
      setBarcode('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan barcode');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <QrCodeIcon />
          <Typography variant="h6">Scan Barcode</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" gutterBottom>
            Enter the barcode manually or use a barcode scanner device:
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <TextField
              inputRef={inputRef}
              fullWidth
              label="Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              placeholder="Scan or enter barcode..."
              disabled={loading}
            />
            <IconButton 
              color="primary" 
              onClick={handleScan}
              disabled={loading || !barcode.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> In a real environment, this would automatically capture input from a physical barcode scanner device. For this demo, please enter a barcode manually.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleScan}
          disabled={loading || !barcode.trim()}
        >
          {loading ? 'Processing...' : 'Process Barcode'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeScanner;