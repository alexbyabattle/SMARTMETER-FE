import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Container,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import image from '../../data/image';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  amount: '',
  users: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  amount: yup.string().required('Required amount  of units  you  want  to buy'),
  
});

const Request = () => {
  const [selectTouched, setSelectTouched] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseCode, setResponseCode] = useState(null);

  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    try {
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');
  
      if (!accessToken || !userId) {
        console.error('Access token or user ID not found in local storage');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
  
      const formattedData = {
        amount: values.amount,
        createdAt: dayjs(),
        users: [{ id: userId }],
      };
  
      console.log('Sending request to backend with data:', formattedData);
  
      const response = await axios.post('http://localhost:8084/api/incident/create', formattedData, config);
  
      console.log(response.data);
  
      const { header, data } = response.data;
      setResponseStatus(header.responseStatus);
      setResponseCode(header.responseCode);
  
      if (data) {
        const unit = data.unit;
        const users = data.users;
  
        if (users && users.length > 0) {
          const userDepartments = users.map(user => user.department).join(', ');
          console.log('Unit:', unit);
          console.log('Departments:', userDepartments);
        } else {
          console.log('No user details available.');
        }
      }
  
      formik.resetForm();
  
      navigate('/viewRequest');
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };
  

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Container maxWidth="md" sx={{ padding: { xs: 2, sm: 3  } }}>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 3, border: `1px solid ${borderColor}`, p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              mb: 2,
              border: `1px solid ${borderColor}`,
              height: '100px'
            }}
          >
            <Box sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
              <img
                alt="gcla admin"
                width="100%"
                height="100px"
                src={image.smartmeter}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              /> 
            </Box>  
            <Box sx={{ flex: 1, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" align="center">
                <h2>BUY  UNITS</h2>
              </Typography>
            </Box>
            
          </Box>

          <Grid container spacing={2}>
            
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="AMOUNT"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.amount}
                name="amount"
                error={!!formik.touched.amount && !!formik.errors.amount}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12}>
                <DateTimePicker
                  value={formik.values.dateTime}
                  onChange={(newValue) =>
                    formik.setFieldValue('dateTime', newValue)
                  }
                  disableFuture
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                  renderInput={(params) => <TextField fullWidth {...params} variant="filled" />}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              sx={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        {responseStatus && (
          <Box
            sx={{
              mt: 2,
              padding: '1px',
              borderRadius: '1px',
              backgroundColor: responseCode === '0' ? 'success.main' : responseCode === '1' ? 'error.main' : 'transparent',
              borderColor: responseCode === '0' ? 'success.main' : responseCode === '1' ? 'error.main' : 'transparent',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'white',
              display: 'inline-block',
            }}
          >
            <Typography>{responseStatus}</Typography>
          </Box>
        )}
      </form>
    </Container>
  );
};

export default Request;
