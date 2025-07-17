import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  QrCode as BarcodeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { POSProduct } from '../types';

interface ProductSearchProps {
  products: POSProduct[];
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
  onSearch: (term: string, category?: string) => void;
  onSelectProduct: (product: POSProduct) => void;
  onScanBarcode: () => void;
  loading?: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  products,
  categories,
  searchTerm,
  selectedCategory,
  onSearch,
  onSelectProduct,
  onScanBarcode,
  loading = false,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value, selectedCategory !== 'all' ? selectedCategory : undefined);
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const category = event.target.value as string;
    onSearch(searchTerm, category !== 'all' ? category : undefined);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products by name, SKU, or barcode..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onScanBarcode} title="Scan Barcode">
                      <BarcodeIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Products ({products.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {products.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No products found. Try a different search term or category.
              </Typography>
            </Grid>
          ) : (
            products.map((product) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: product.quantity <= 0 && product.category !== 'Repair Services' ? 0.6 : 1,
                  }}
                >
                  <CardActionArea 
                    onClick={() => onSelectProduct(product)}
                    disabled={product.quantity <= 0 && product.category !== 'Repair Services'}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    {product.imageUrl && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={product.imageUrl}
                        alt={product.name}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography variant="subtitle2" noWrap title={product.name}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        SKU: {product.sku}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${product.price.toFixed(2)}
                        </Typography>
                        {product.quantity <= 0 && product.category !== 'Repair Services' ? (
                          <Chip label="Out of Stock" size="small" color="error" />
                        ) : (
                          <Chip label="Add" size="small" color="primary" />
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductSearch;