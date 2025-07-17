'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  QrCode as BarcodeIcon,
  AutoAwesome as GenerateIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { productSchema } from '../schema';
import { ProductFormData, ProductCategory } from '../types';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Partial<ProductFormData>;
  loading?: boolean;
  categories: ProductCategory[];
  onGenerateBarcode: () => Promise<string>;
  onGenerateSku: (category: string) => Promise<string>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  categories,
  onGenerateBarcode,
  onGenerateSku,
}) => {
  const [newTag, setNewTag] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState<string>('');
  
  const methods = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      sku: '',
      barcode: '',
      name: '',
      description: '',
      category: '',
      brand: '',
      unit: 'piece',
      costPrice: 0,
      sellingPrice: 0,
      quantity: 0,
      minStockLevel: 1,
      maxStockLevel: undefined,
      location: '',
      supplier: '',
      status: 'active',
      tags: [],
      ...initialData,
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const tags = watch('tags');
  const watchedCategory = watch('category');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        sku: '',
        barcode: '',
        name: '',
        description: '',
        category: '',
        brand: '',
        unit: 'piece',
        costPrice: 0,
        sellingPrice: 0,
        quantity: 0,
        minStockLevel: 1,
        maxStockLevel: undefined,
        location: '',
        supplier: '',
        status: 'active',
        tags: [],
        ...initialData,
      });
      setImagePreview('');
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      reset();
      setImagePreview('');
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleGenerateBarcode = async () => {
    try {
      const barcode = await onGenerateBarcode();
      setValue('barcode', barcode);
    } catch (error) {
      console.error('Failed to generate barcode:', error);
    }
  };

  const handleGenerateSku = async () => {
    if (!watchedCategory) {
      alert('Please select a category first');
      return;
    }
    
    try {
      const sku = await onGenerateSku(watchedCategory);
      setValue('sku', sku);
    } catch (error) {
      console.error('Failed to generate SKU:', error);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue('tags', [...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...categories.map(category => ({ value: category.name, label: category.name })),
  ];

  const unitOptions = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'g', label: 'Gram' },
    { value: 'liter', label: 'Liter' },
    { value: 'ml', label: 'Milliliter' },
    { value: 'meter', label: 'Meter' },
    { value: 'cm', label: 'Centimeter' },
    { value: 'set', label: 'Set' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  const availableTags = ['New', 'Popular', 'Sale', 'Featured', 'Limited', 'Premium', 'Eco-friendly', 'Bestseller'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Product Image */}
              <Grid item xs={12} md={3}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      bgcolor: 'grey.200',
                      border: '2px dashed',
                      borderColor: 'grey.400'
                    }}
                    src={imagePreview}
                  >
                    <ImageIcon sx={{ fontSize: 40, color: 'grey.600' }} />
                  </Avatar>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => {
                      // Mock image URL for demo
                      const mockImages = [
                        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
                        'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=300',
                        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
                        'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=300',
                        'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300',
                      ];
                      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
                      setImagePreview(randomImage);
                    }}
                  >
                    Upload Image
                  </Button>
                  <Typography variant="caption" color="text.secondary" align="center">
                    Click to upload product image
                  </Typography>
                </Box>
              </Grid>

              {/* Basic Information */}
              <Grid item xs={12} md={9}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" gap={1} alignItems="flex-end">
                      <Box flexGrow={1}>
                        <FormField
                          name="sku"
                          label="SKU"
                          required
                          helperText="Stock Keeping Unit"
                        />
                      </Box>
                      <IconButton
                        onClick={handleGenerateSku}
                        color="primary"
                        title="Generate SKU"
                      >
                        <GenerateIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" gap={1} alignItems="flex-end">
                      <Box flexGrow={1}>
                        <FormField
                          name="barcode"
                          label="Barcode"
                          helperText="Product barcode (optional)"
                        />
                      </Box>
                      <IconButton
                        onClick={handleGenerateBarcode}
                        color="primary"
                        title="Generate Barcode"
                      >
                        <BarcodeIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      name="name"
                      label="Product Name"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      name="description"
                      label="Description"
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="category"
                      label="Category"
                      type="select"
                      options={categoryOptions}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="brand"
                      label="Brand"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Pricing & Inventory */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Pricing & Inventory
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormField
                      name="unit"
                      label="Unit"
                      type="select"
                      options={unitOptions}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormField
                      name="costPrice"
                      label="Cost Price ($)"
                      type="number"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormField
                      name="sellingPrice"
                      label="Selling Price ($)"
                      type="number"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormField
                      name="status"
                      label="Status"
                      type="select"
                      options={statusOptions}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="quantity"
                      label="Current Quantity"
                      type="number"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="minStockLevel"
                      label="Minimum Stock Level"
                      type="number"
                      required
                      helperText="Alert when stock falls below this level"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="maxStockLevel"
                      label="Maximum Stock Level"
                      type="number"
                      helperText="Optional maximum stock capacity"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="location"
                      label="Storage Location"
                      helperText="Warehouse location or shelf number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="supplier"
                      label="Supplier"
                      helperText="Primary supplier for this product"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Tags
                </Typography>
                <Box display="flex" gap={1} mb={2} alignItems="center">
                  <TextField
                    size="small"
                    label="Add Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <IconButton onClick={handleAddTag} color="primary">
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {availableTags
                    .filter(tag => !tags.includes(tag))
                    .map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => setValue('tags', [...tags, tag])}
                        variant="outlined"
                        size="small"
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Add Product')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ProductForm;