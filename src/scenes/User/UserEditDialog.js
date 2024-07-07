import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';

const checkoutSchema = yup.object().shape({
  name: yup.string().required('Required name'),
  phoneNumber: yup.string().required('Required phoneNumber'),
  location: yup.string().required('Required location'),
  status: yup.string().required('Required'),
  department: yup.string().required('department is required'),
  role: yup.string().required('role is required'),
});

const UserEditDialog = ({ userId, open, onClose, loadUsers }) => {
  console.log('Selected User ID for edit:', userId);

  const [userData, setUserData] = useState({});
  const [editedData, setEditedData] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    status: '',
    department: '',
    role: '',
  });

  const fetchUserData = async (userId) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(`http://localhost:8084/api/v1/users/get/${userId}`, config);
      console.log('Fetched user data:', response.data);
      setUserData(response.data);
      setEditedData(response.data); // Initialize editedData with fetched userData
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserData(userId);
    }
  }, [open, userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('Input changed:', { name, value });
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Saving user data:', editedData); // Add this log here
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      // Send edited data to the server
      await axios.put(`http://localhost:8084/api/v1/users/update/${userId}`, editedData, config);

      // Close the dialog
      onClose();
      loadUsers();
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <DialogContentText>Please edit the user details</DialogContentText>
        <Formik
          enableReinitialize
          initialValues={{
            name: editedData.name,
            phoneNumber: editedData.phoneNumber,
            location: editedData.location,
            status: editedData.status,
            department: editedData.department,
            role: editedData.role,
            //dateTime: dayjs(),
          }}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="name"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="PhoneNumber"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.phoneNumber}
                    name="phoneNumber"
                    error={!!touched.phoneNumber && !!errors.phoneNumber}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="location"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.location}
                    name="location"
                    error={!!touched.location && !!errors.location}
                    helperText={touched.location && errors.location}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="department"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.department}
                    name="department"
                    error={!!touched.department && !!errors.department}
                    helperText={touched.department && errors.department}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="role"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.role}
                    name="role"
                    error={!!touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
                  />
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={6}>
                    <div style={{ marginTop: '10px' }} />
                    <DateTimePicker
                      value={values.dateTime}
                      onChange={(newValue) =>
                        handleInputChange({
                          target: { name: 'dateTime', value: newValue },
                        })
                      }
                      disableFuture
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
                <Button type="submit" color="secondary" variant="contained" onClick={() => handleSave()}>
                  Submit
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
