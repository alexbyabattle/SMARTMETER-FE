import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Snackbar,
  Avatar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';

const UserDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const [userData, setUserData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');

  const loadUserDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8084/api/v1/users/get/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log('Response data:', response.data);
      const { data } = response.data;
      console.log('User data:', data); // Added debug statement
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      console.error('Full error object:', error);
      showSnackbar('error', 'Error fetching user details');
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode === '0' ? 'success' : 'error');
    setSnackbarOpen(true);
  };

  return (
    <Box elevation={3}>
      {userData && (
        <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px', border: `1px solid ${borderColor}`, marginLeft: "7px", marginRight: "5px" }}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
            <Avatar
              alt="Profile Picture"
              src={userData.profilePicture} // Assuming you have a profilePicture URL in your data
              sx={{ width: 80, height: 80, marginRight: 2 }}
            />
            <Box>
              <Typography variant="body1">
                <strong style={{ marginRight: '10px' }}>UserName:</strong> {userData.name}
              </Typography>
              <Typography variant="body1">
                <strong style={{ marginRight: '10px' }}>Email:</strong> {userData.email}
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box flex="1">
              <Typography variant="h6">USER DETAILS</Typography>
              <ul>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Phone Number:</strong> {userData.phoneNumber}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Location:</strong> {userData.location}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Department:</strong> {userData.department}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>CreatedAt:</strong> {userData.createdAt}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Role:</strong> {userData.role}
                  </Typography>
                </li>
              </ul>
            </Box>
            <Box flex="1">
              <ul>
                <strong style={{ marginLeft: '4px' }}>DEVICES OF USER:</strong>
                {userData.devices && userData.devices
                 
                  .map((device, index) => (
                    <li key={index}>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}> deviceName: </strong> {device.deviceName}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} >device Number:</strong> {device.deviceNumber}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} >manufactural:</strong> {device.manufactural}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} >STATUS:</strong> {device.status}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}>Assigned At:</strong> {device.createdAt}
                      </Typography>
                    </li>
                  ))}
              </ul>
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarColor }}
      />
    </Box>
  );
};

export default UserDetails;
