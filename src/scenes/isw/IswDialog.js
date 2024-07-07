import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useState , useEffect } from 'react';
import axios from 'axios';
import { Formik , Form , Field} from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const initialValues = {
  iswName: '',
  selectedIncidents: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  iswName: yup.string().required('Required incident solving way'),
  selectedIncidents: yup.array(),
  dateTime: yup.date().required('Date and time are required'),
});

function MyFormDialog({ open, onClose, loadIsws, showSnackbar }) {
  const [selectTouched, setSelectTouched] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidents, setSelectedIncidents] = useState([]);

  const handleFormSubmit = async (values) => {
    try {
      const postData = {
        iswName: values.iswName,
        incidents: selectedIncidents.map((id) => ({ id })),
        dateTime: values.dateTime,
      };

      const response = await axios.post('http://localhost:8082/api/isw/create', postData);

      if (response.status === 200) {
        const responseCode = response.data.header.responseCode;
        const responseStatus = response.data.header.responseStatus;

        // Determine snackbar color based on response code
        const snackbarColor = responseCode === 0 ? 'success' : 'error';

        // Use response status as the snackbar message
        showSnackbar(snackbarColor, responseStatus);
        console.log('Success: Data has been posted to the API');
        loadIsws();
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
  }

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/incident')
      .then((response) => {
        setIncidents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching incidents:', error);
      });
  }, []);

  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle> Add Incident Solving  Way</DialogTitle>
      <DialogContent>
        <DialogContentText> </DialogContentText>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Solving Way"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.iswName}
                    name="iswName"
                    error={touched.iswName && !!errors.iswName}
                    helperText={touched.iswName && errors.iswName}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    variant="filled"
                    label="Incidents of ISW"
                    onBlur={() => {
                      setSelectTouched(true); // Mark select as touched
                    }}
                    onChange={(e) => {
                      const selectedIds = e.target.value;
                      setSelectedIncidents(selectedIds);
                      setSelectTouched(false); // Clear the selectTouched state
                      handleChange(e);
                    }}
                    value={values.selectedIncidents}
                    name="selectedIncidents"
                    helperText={selectTouched && values.selectedIncidents.length === 0 && 'At least one incident must be selected'}
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) => {
                        return selected
                          .map((selectedIncident) => {
                            const incident = incidents.find((incident) => incident.id === selectedIncident);
                            return incident ? incident.incidentTitle : '';
                          })
                          .join(', ');
                      },
                    }}
                  >
                    {incidents.map((incident) => (
                      <MenuItem key={incident.id} value={incident.id}>
                        {incident.incidentTitle}
                      </MenuItem>
                    ))}
                  </TextField>
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
};

export default MyFormDialog;
