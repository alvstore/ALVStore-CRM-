import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import { TicketComment } from '../types';

interface CommentListProps {
  comments: TicketComment[];
  loading?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  loading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'primary';
      case 'staff': return 'secondary';
      case 'technician': return 'info';
      case 'client': return 'default';
      default: return 'default';
    }
  };

  if (comments.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No comments yet. Be the first to add a comment.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {comments.map((comment, index) => (
        <Paper 
          key={comment.id} 
          sx={{ 
            p: 2, 
            mb: 2,
            bgcolor: comment.isInternal ? 'rgba(255, 244, 229, 0.7)' : 'background.paper',
            border: comment.isInternal ? '1px dashed #ff9800' : 'none',
          }}
        >
          {comment.isInternal && (
            <Chip 
              label="INTERNAL NOTE" 
              color="warning" 
              size="small" 
              sx={{ mb: 1 }} 
            />
          )}
          
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Avatar
              sx={{ 
                bgcolor: comment.createdByRole === 'client' ? 'primary.main' : 'secondary.main',
              }}
            >
              {comment.createdByName.charAt(0)}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {comment.createdByName}
                  </Typography>
                  <Chip 
                    label={comment.createdByRole.toUpperCase()} 
                    color={getRoleColor(comment.createdByRole)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(comment.createdAt)}
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {comment.content}
              </Typography>
              
              {comment.attachments && comment.attachments.length > 0 && (
                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Attachments:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {comment.attachments.map((attachment, i) => (
                      <Chip
                        key={i}
                        label={attachment.split('/').pop()}
                        variant="outlined"
                        size="small"
                        component="a"
                        href={attachment}
                        target="_blank"
                        clickable
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default CommentList;