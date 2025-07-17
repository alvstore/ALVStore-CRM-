'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import FileUploader from '@/components/common/FileUploader';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { ClientFile } from '../types';
import { useSnackbar } from 'notistack';

interface FilesTabProps {
  files: ClientFile[];
  onUploadFile: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  loading?: boolean;
}

const FilesTab: React.FC<FilesTabProps> = ({
  files,
  onUploadFile,
  onDeleteFile,
  loading = false,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<ClientFile | null>(null);

  const handleUploadFiles = async (uploadedFiles: File[]) => {
    try {
      for (const file of uploadedFiles) {
        await onUploadFile(file);
      }
      enqueueSnackbar(`${uploadedFiles.length} file(s) uploaded successfully`, { variant: 'success' });
      return uploadedFiles.map(file => URL.createObjectURL(file));
    } catch (error) {
      enqueueSnackbar('Failed to upload files', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    
    try {
      await onDeleteFile(fileToDelete.id);
      enqueueSnackbar('File deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete file', { variant: 'error' });
    }
  };

  const openDeleteDialog = (file: ClientFile) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon />;
    } else if (type === 'application/pdf') {
      return <PdfIcon />;
    }
    return <FileIcon />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Files ({files.length})
      </Typography>

      <Box mb={3}>
        <FileUploader
          onUpload={handleUploadFiles}
          onRemove={(url) => {
            // Handle remove from uploader if needed
          }}
          maxFiles={10}
          maxSize={10}
          acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt']}
          disabled={loading}
        />
      </Box>

      {files.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No files uploaded yet. Use the uploader above to add files.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List>
            {files.map((file, index) => (
              <ListItem key={file.id} divider={index < files.length - 1}>
                <ListItemIcon>
                  {getFileIcon(file.type)}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Chip
                        label={formatFileSize(file.size)}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Uploaded on {formatDate(file.uploadedAt)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => window.open(file.url, '_blank')}
                    sx={{ mr: 1 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => openDeleteDialog(file)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Card>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete File"
        message={`Are you sure you want to delete "${fileToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteFile}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setFileToDelete(null);
        }}
        severity="error"
        confirmText="Delete"
        loading={loading}
      />
    </Box>
  );
};

export default FilesTab;