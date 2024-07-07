import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useTheme } from '@mui/material';
import image from '../../data/image';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  organisation: 'GELA',
  branch: 'DSM',
  dateOccurred: dayjs(),
  ref: '',
  problemNature: 'Hardware',
  module: 'PRINTER',
  description: '',
  systemError: '',
  reportedBy: '',
  designation: '',
  signature: '',
  dateReported: dayjs(),
  authorisedBy: '',
  priority: '1',
  taskAllocatedTo: 'VENDOR',
  taskCompletionVerifiedBy: '',
  dateOfCompletion: dayjs(),
  problemSolution: ''
};

const validationSchema = yup.object().shape({
  organisation: yup.string().required('Required'),
  branch: yup.string().required('Required'),
  dateOccurred: yup.date().required('Required'),
  ref: yup.string().required('Required'),
  problemNature: yup.string().required('Required'),
  module: yup.string().required('Required'),
  description: yup.string().required('Required'),
  systemError: yup.string().required('Required'),
  reportedBy: yup.string().required('Required'),
  designation: yup.string().required('Required'),
  signature: yup.string().required('Required'),
  dateReported: yup.date().required('Required'),
  authorisedBy: yup.string().required('Required'),
  priority: yup.string().required('Required'),
  taskAllocatedTo: yup.string().required('Required'),
  taskCompletionVerifiedBy: yup.string().required('Required'),
  dateOfCompletion: yup.date().required('Required'),
  problemSolution: yup.string().required('Required')
});

const ReportForm = () => {
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken || !userId) {
          console.error('Access token or user ID not found in local storage');
          return;
        }

        const postData = {
          ...values,
          dateOccurred: values.dateOccurred.toISOString(),
          dateReported: values.dateReported.toISOString(),
          dateOfCompletion: values.dateOfCompletion.toISOString(),
        };

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.post(
          'http://localhost:8082/api/incident/create',
          postData,
          config
        );

        formik.resetForm();
        navigate('/incidents');
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ mt: 3, border: `1px solid ${borderColor}`, p: 3 }}
      >
        <Box
          height="100px"
          sx={{
            padding: 0,
            border: `1px solid ${borderColor}`,
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 0, overflow: 'hidden' }}>
            <img
              alt="gcla admin"
              width="100%"
              height="100px"
              src={image.george}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </Box>
          <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" align="center">INCIDENT REPORTING FORM</Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column', 
              alignItems: 'start',   
              justifyContent: 'start' 
            }}
          >
            <Typography variant="h6" align="center">ID: </Typography>
            <Typography variant="h6" align="center">DATE: </Typography>
          </Box>


        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="organisation"
              label="Organisation"
              fullWidth
              value={formik.values.organisation}
              onChange={formik.handleChange}
              error={formik.touched.organisation && Boolean(formik.errors.organisation)}
              helperText={formik.touched.organisation && formik.errors.organisation}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="branch"
              label="Branch"
              fullWidth
              value={formik.values.branch}
              onChange={formik.handleChange}
              error={formik.touched.branch && Boolean(formik.errors.branch)}
              helperText={formik.touched.branch && formik.errors.branch}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date and Time Incident Occurred"
                value={formik.values.dateOccurred}
                onChange={(date) => formik.setFieldValue('dateOccurred', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.dateOccurred && Boolean(formik.errors.dateOccurred)}
                    helperText={formik.touched.dateOccurred && formik.errors.dateOccurred}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="ref"
              label="REF"
              fullWidth
              value={formik.values.ref}
              onChange={formik.handleChange}
              error={formik.touched.ref && Boolean(formik.errors.ref)}
              helperText={formik.touched.ref && formik.errors.ref}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              name="problemNature"
              label="Nature of the Problem"
              fullWidth
              value={formik.values.problemNature}
              onChange={formik.handleChange}
              error={formik.touched.problemNature && Boolean(formik.errors.problemNature)}
              helperText={formik.touched.problemNature && formik.errors.problemNature}
            >
              <MenuItem value="Software">Software</MenuItem>
              <MenuItem value="OS">OS</MenuItem>
              <MenuItem value="Hardware">Hardware</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="module"
              label="Module/Program Name"
              fullWidth
              value={formik.values.module}
              onChange={formik.handleChange}
              error={formik.touched.module && Boolean(formik.errors.module)}
              helperText={formik.touched.module && formik.errors.module}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description of Incident"
              fullWidth
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="systemError"
              label="System Error Messages and Codes Reported"
              fullWidth
              value={formik.values.systemError}
              onChange={formik.handleChange}
              error={formik.touched.systemError && Boolean(formik.errors.systemError)}
              helperText={formik.touched.systemError && formik.errors.systemError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="reportedBy"
              label="Reported By"
              fullWidth
              value={formik.values.reportedBy}
              onChange={formik.handleChange}
              error={formik.touched.reportedBy && Boolean(formik.errors.reportedBy)}
              helperText={formik.touched.reportedBy && formik.errors.reportedBy}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="designation"
              label="Designation"
              fullWidth
              value={formik.values.designation}
              onChange={formik.handleChange}
              error={formik.touched.designation && Boolean(formik.errors.designation)}
              helperText={formik.touched.designation && formik.errors.designation}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="signature"
              label="Signature"
              fullWidth
              value={formik.values.signature}
              onChange={formik.handleChange}
              error={formik.touched.signature && Boolean(formik.errors.signature)}
              helperText={formik.touched.signature && formik.errors.signature}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date Reported"
                value={formik.values.dateReported}
                onChange={(date) => formik.setFieldValue('dateReported', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.dateReported && Boolean(formik.errors.dateReported)}
                    helperText={formik.touched.dateReported && formik.errors.dateReported}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="authorisedBy"
              label="Authorised By"
              fullWidth
              value={formik.values.authorisedBy}
              onChange={formik.handleChange}
              error={formik.touched.authorisedBy && Boolean(formik.errors.authorisedBy)}
              helperText={formik.touched.authorisedBy && formik.errors.authorisedBy}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="priority"
              label="Priority"
              fullWidth
              value={formik.values.priority}
              onChange={formik.handleChange}
              error={formik.touched.priority && Boolean(formik.errors.priority)}
              helperText={formik.touched.priority && formik.errors.priority}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="taskAllocatedTo"
              label="Task Allocated To"
              fullWidth
              value={formik.values.taskAllocatedTo}
              onChange={formik.handleChange}
              error={formik.touched.taskAllocatedTo && Boolean(formik.errors.taskAllocatedTo)}
              helperText={formik.touched.taskAllocatedTo && formik.errors.taskAllocatedTo}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="taskCompletionVerifiedBy"
              label="Task Completion Verified By"
              fullWidth
              value={formik.values.taskCompletionVerifiedBy}
              onChange={formik.handleChange}
              error={formik.touched.taskCompletionVerifiedBy && Boolean(formik.errors.taskCompletionVerifiedBy)}
              helperText={formik.touched.taskCompletionVerifiedBy && formik.errors.taskCompletionVerifiedBy}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date of Task Completion"
                value={formik.values.dateOfCompletion}
                onChange={(date) => formik.setFieldValue('dateOfCompletion', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.dateOfCompletion && Boolean(formik.errors.dateOfCompletion)}
                    helperText={formik.touched.dateOfCompletion && formik.errors.dateOfCompletion}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="problemSolution"
              label="Description of How the Problem was Solved"
              fullWidth
              value={formik.values.problemSolution}
              onChange={formik.handleChange}
              error={formik.touched.problemSolution && Boolean(formik.errors.problemSolution)}
              helperText={formik.touched.problemSolution && formik.errors.problemSolution}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ReportForm;
