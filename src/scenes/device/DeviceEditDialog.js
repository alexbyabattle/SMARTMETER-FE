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
  deviceName: yup.string().required('Required device name'),
  deviceNumber: yup.string().required('Required device number'),
  manufactural: yup.string().required('Required manufacturer'),
  state: yup.string().required('Required'),
});

const DeviceEditDialog = ({ deviceId, open, onClose, loadDevices }) => {
  console.log('Selected Device ID for edit:', deviceId);
  const [deviceData, setDeviceData] = useState({});
  const [editedData, setEditedData] = useState({});

  const fetchDeviceData = async (deviceId) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(`http://localhost:8082/api/v1/device/${deviceId}`, config);
      console.log('Fetched device data:', response.data); // Add a log to see the fetched device data
      setDeviceData(response.data);
      setEditedData(response.data);
    } catch (error) {
      console.error('Error fetching device data:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDeviceData(deviceId);
    }
  }, [open, deviceId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('Input changed:', { name, value }); // Add a log to see when input changes
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Saving device data:', editedData); // Add this log here
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      // Send edited data to the server
      await axios.put(`http://localhost:8082/api/v1/device/${deviceId}`, editedData, config);
  
      // Close the dialog
      onClose();
      loadDevices();
    } catch (error) {
      console.error('Error updating device data:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Device</DialogTitle>
      <DialogContent>
        <DialogContentText>Please edit the device details</DialogContentText>
        <Formik
          enableReinitialize
          initialValues={{
            deviceName: editedData.deviceName || '',
            deviceNumber: editedData.deviceNumber || '',
            manufactural: editedData.manufactural || '',
            state: editedData.state || '',
            dateTime: dayjs(),
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
                    label="Device Name"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.deviceName}
                    name="deviceName"
                    error={!!touched.deviceName && !!errors.deviceName}
                    helperText={touched.deviceName && errors.deviceName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Device Number"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.deviceNumber}
                    name="deviceNumber"
                    error={!!touched.deviceNumber && !!errors.deviceNumber}
                    helperText={touched.deviceNumber && errors.deviceNumber}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Manufacturer"
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={editedData.manufactural}
                    name="manufactural"
                    error={!!touched.manufactural && !!errors.manufactural}
                    helperText={touched.manufactural && errors.manufactural}
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

export default DeviceEditDialog;
