import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Box, Typography, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import image from '../../data/image';

const initialValues = {
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    location: '',
    password: '',
    confirmPassword: '',
};

const registrationSchema = yup.object().shape({
    name: yup.string().required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    phoneNumber: yup.string().required('Required phoneNUmber'),
    department: yup.string().required('Required meter number'),
    location: yup.string().required('Required location'),
    password: yup.string().required('Required password'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
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
            const response = await axios.post('http://localhost:8084/api/v1/auth/register', values);
            const { id, name, email, accessToken } = response.data;

            // Store user details and accessToken in local storage
            localStorage.setItem('userId', id);
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            localStorage.setItem('accessToken', accessToken);

            showSnackbar('Registration successful.', 'success');

            // Redirect to another page after successful registration
            navigate('/');
        } catch (error) {
            showSnackbar('Failed to register user. Please try again later.', 'error');
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: registrationSchema,
        onSubmit: handleFormSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit}> {/* Form element */}
            <Box
                bgcolor="#0D1825"
                borderRadius={5}
                mt={2}
                mx="auto"
                width="95%"
                height="98%"
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }} // For responsive layout
                alignItems="center"
                justifyContent="center"
                boxShadow={3}
                
            >
                <Box width={{ xs: '100%', md: '50%' }} height="100%">
                    <img
                        alt="gcla admin"
                        width="100%"
                        height="600px"
                        src={image.george}
                        style={{ objectFit: 'cover' }} // Adjust image styling
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width={{ xs: '100%', md: '50%' }} // For responsive layout
                    height="100%"
                    p={2} // Adjust padding as needed
                >
                    <Box mb={2} display="flex" justifyContent="center">
                        <Typography component="h2" variant="h2">
                            REGISTER YOUR DETAILS
                        </Typography>
                    </Box>
                    <Box width="100%">
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Username"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    name="name"
                                    error={!!formik.touched.name && !!formik.errors.name}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="email"
                                    label="Email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    name="email"
                                    error={!!formik.touched.email && !!formik.errors.email}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="phoneNumber"
                                    label="phoneNumber"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.phoneNumber}
                                    name="phoneNumber"
                                    error={!!formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="department"
                                    label="meter number"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.department}
                                    name="department"
                                    error={!!formik.touched.department && !!formik.errors.department}
                                    helperText={formik.touched.department && formik.errors.department}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="location"
                                    label="location"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.location}
                                    name="location"
                                    error={!!formik.touched.location && !!formik.errors.location}
                                    helperText={formik.touched.location && formik.errors.location}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
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
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="password"
                                    label="Confirm Password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.confirmPassword}
                                    name="confirmPassword"
                                    error={!!formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={3} display="flex" justifyContent="center">
                        <Button
                            type="submit"
                            color="secondary"
                            variant="contained"
                            style={{ padding: '10px 20px', fontSize: '16px' }}
                        >
                            Register
                        </Button>
                    </Box>
                    {/* Link to Login Page */}
                    <Box mt={2} display="flex" justifyContent="center">
                        <Typography variant="body1">
                            Already have an account?{' '}
                            <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                                Click here to login
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </form>
    );
};

export default Register;
