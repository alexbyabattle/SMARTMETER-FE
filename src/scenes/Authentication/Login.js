import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Box,
  Avatar,
  Typography,
  Snackbar,
  Link, 
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import image from '../../data/image';
import { Link as RouterLink } from 'react-router-dom';

const initialValues = {
  email: '',
  password: '',
};

const checkoutSchema = yup.object().shape({
  email: yup.string().required('Required email'),
  password: yup.string().required('Required password'),
});

const Login = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const formattedData = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post('http://localhost:8084/api/v1/auth/authenticate', formattedData);

      const { message, access_token, refresh_token, id, userName, email, role } = response.data;

      // Store the token in local storage
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', userName);
      localStorage.setItem('email', email);
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('role', role);

      showSnackbar(message, 'success');

      // Redirect to appropriate dashboard based on user role
      if (role === 'USER') {
        navigate('/userDashboard');
      } else if (role === 'ADMIN') {
        navigate('/dashboard');
      }
    } catch (error) {
      // Reset form values
      formik.resetForm();

      // Handle network error or other issues
      showSnackbar('User failed to log in with incorrect credentials.', 'error');
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: handleFormSubmit,
  });

  // Get base URL
  const baseUrl = window.location.origin;

  return (
    <Box
      bgcolor="#0D1825"
      p={4}
      borderRadius={5}
      mt={8}
      mx="auto"
      maxWidth={500}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      boxShadow={3}
    >
      <Typography component="h1" variant="h4" mb={2} color="secondary">
        SMART METER MANAGEMENT SYSTEM
      </Typography>

      <Avatar sx={{ m: 2, bgcolor: 'secondary.main', width: 100, height: 100 }}>
        <img
          alt="gcla admin"
          width="100%"
          height="100%"
          src={image.smartmeter}
          style={{ cursor: 'pointer', borderRadius: '50%' }}
        />
      </Avatar>

      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <Box mb={2} display="flex" justifyContent="center">
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              name="email"
              error={!!formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="filled"
              type="password"
              label="Password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              name="password"
              error={!!formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="center">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Submit
          </Button>
        </Box>
      </form>

      {/* Link to Register Page */}
      <Box mt={2} display="flex" justifyContent="center">
        <Typography variant="body1">
          Don't have an account?{' '}
          <Link to={`${baseUrl}/register`} component={RouterLink} style={{ color: 'blue', textDecoration: 'underline' }}>
            Click here to register
          </Link>
        </Typography>
      </Box>

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

export default Login;
