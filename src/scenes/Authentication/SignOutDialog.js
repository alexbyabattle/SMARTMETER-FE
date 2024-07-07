import React from 'react';
import { Button, Dialog, DialogContent, DialogActions, Typography, Box } from '@mui/material';

const SignOutDialog = ({ open, onClose, setLogoutDialogOpen }) => {

  const handleLogoutConfirm = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem('accessToken');

    // Determine the base URL dynamically
    const baseUrl = window.location.origin;
    
    // Redirect the user to the login page
    window.location.href = `${baseUrl}/`;
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  }; 

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80px' }}>
        <Typography variant="body1">
          Do you want to logout?
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Box display="flex" justifyContent="center" mt="20px">
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">
            Logout
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
};

export default SignOutDialog;
