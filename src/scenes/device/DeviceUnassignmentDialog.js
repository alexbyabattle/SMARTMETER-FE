import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';

const initialValues = {
  selectedUsers: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  selectedUsers: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

function UnassignDialog({ open, onClose, loadDeviceDetails, showSnackbar, selectedDevices }) {
  const [selectTouched, setSelectTouched] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleDeviceAssignment = async (values) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const postData = {
        deviceIds: selectedDevices,
        userIds: selectedUsers.map((user) => user.id), // Extracting IDs from selected users
      };

      console.log('Data to be sent:', postData);

      const response = await axios.post('http://localhost:8082/api/v1/device/unassign', postData, config);

      console.log('Response:', response);
      console.log('Response Data:', response.data);

      if (response.status === 200) {
        const responseCode = response.data.header.responseCode;
        const responseStatus = response.data.header.responseStatus;

        // Determine snackbar color based on response code
        const snackbarColor = responseCode === 0 ? 'success' : 'error';

        // Use response status as the snackbar message
        showSnackbar(snackbarColor, responseStatus);
        console.log('Success: Data has been posted to the API');
        loadDeviceDetails();
        onClose();
        setSelectTouched(false);
      } else {
        // Use response status as the snackbar message for error cases
        showSnackbar('error', response.data.header.responseStatus);
        console.error('Error: Something went wrong with the API request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('Access token not found in local storage');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get('http://localhost:8082/api/v1/users/all', config);

        console.log('Response:', response);
        console.log('Response Data:', response.data);

        if (response.data && response.data.data) {
          // Map response data to format suitable for select field
          const formattedUsers = response.data.data.map((user) => ({
            id: user.id,
            name: user.name,
          }));
          setUsers(formattedUsers);
        } else {
          console.error('Invalid response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>UNASSIGN USER FROM A  DEVICE</DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleDeviceAssignment}>
          {({ values, errors, touched, handleBlur, handleChange, setFieldTouched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={users}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setSelectedUsers(newValue);
                      setSelectTouched(true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="USER TO BE UNASSIGNED DEVICE"
                        variant="filled"
                        onBlur={() => {
                          setSelectTouched(true); // Mark select as touched
                        }}
                        helperText={
                          selectTouched && selectedUsers.length === 0 && 'At least one user must be selected'
                        }
                      />
                    )}
                  />
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={6}>
                    <div style={{ marginTop: '10px' }} />
                    <DateTimePicker
                      value={values.dateTime}
                      onChange={(newValue) =>
                        handleChange({
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
                <Button type="submit" variant="contained" color="secondary">
                  Submit
                </Button>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default UnassignDialog;
