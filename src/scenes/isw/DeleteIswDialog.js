import React  from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  
} from '@mui/material';

const dialogContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80px',
};

function DeleteDialog({ open, onClose, iswId, showSnackbar }) {
  const deleteItem = () => {
    // Define the API endpoint for deleting the item
    const deleteData = `http://localhost:8082/api/isw/delete/${iswId}`;

    // Make an HTTP DELETE request to delete the item
    axios
      .delete(deleteData)
      .then((response) => {
        // Handle the success response (e.g., update UI)
        console.log('Item deleted successfully');

        // Determine snackbar color and message based on the response code
        const responseCode = response.data.header.responseCode;
        const responseStatus = response.data.header.responseStatus;

       
        if (responseCode === 0) {
          showSnackbar('success', responseStatus);
        } else {
          showSnackbar('error', responseStatus);
        }
        // Close the dialog
        onClose();
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error('Error deleting item:', error);

        // Close the dialog
        onClose();
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent style={dialogContentStyle}>
        <Typography variant="body1">
          Do you want to delete the specified data?
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Box display="flex" justifyContent="center" mt="20px">
          <Button onClick={deleteItem} color="error" variant="contained">
            Delete
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" mt="20px">
          <Button onClick={onClose} color="secondary" variant="contained">
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
