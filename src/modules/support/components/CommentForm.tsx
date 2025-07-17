import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TicketCommentFormData } from '../types';

interface CommentFormProps {
  onSubmit: (data: TicketCommentFormData) => Promise<void>;
  loading?: boolean;
  allowInternal?: boolean;
}

const commentSchema = yup.object({
  content: yup.string().required('Comment is required').min(2, 'Comment must be at least 2 characters'),
  isInternal: yup.boolean().default(false),
});

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  loading = false,
  allowInternal = true,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<TicketCommentFormData>({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: '',
      isInternal: false,
    },
  });

  const handleFormSubmit = async (data: TicketCommentFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Add Comment
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={3}
              placeholder="Type your comment here..."
              error={!!errors.content}
              helperText={errors.content?.message}
              sx={{ mb: 2 }}
            />
          )}
        />
        
        {allowInternal && (
          <Controller
            name="isInternal"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                  />
                }
                label="Internal note (not visible to client)"
                sx={{ mb: 2 }}
              />
            )}
          />
        )}
        
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<SendIcon />}
          >
            {loading ? 'Sending...' : 'Send Comment'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CommentForm;