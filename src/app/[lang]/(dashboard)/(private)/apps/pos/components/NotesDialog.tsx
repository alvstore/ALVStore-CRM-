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
} from '@mui/material';
import { Note as NoteIcon } from '@mui/icons-material';

interface NotesDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  initialNotes?: string;
  loading?: boolean;
}

const NotesDialog: React.FC<NotesDialogProps> = ({
  open,
  onClose,
  onSave,
  initialNotes = '',
  loading = false,
}) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setNotes(initialNotes);
    }
  }, [open, initialNotes]);

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <NoteIcon />
          <Typography variant="h6">Add Notes</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Add notes about this sale..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            autoFocus
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={loading}
        >
          Save Notes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesDialog;