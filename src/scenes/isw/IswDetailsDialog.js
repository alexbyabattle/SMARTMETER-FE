import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Paper,
  Typography,
} from '@mui/material';

const IswDetailsDialog = ({ id, open, onClose }) => {
  const [iswData, setIswData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/isw/getIswWithIncidents/${id}`)
      .then((response) => {
        // Extract the "data" field from the response
        const { data } = response.data;
        setIswData(data);
      })
      .catch((error) => {
        console.error('Error fetching isw details:', error);
      });
  }, [id]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>INCIDENT SOLVING WAY DETAILS</DialogTitle>
      <DialogContent>
        {iswData ? (
          <div>
            <Paper elevation={3} sx={{ padding: '10px', marginBottom: '8px' }}>
              <strong style={{ marginLeft: '4px' }}>Incident Solving Way:</strong>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                {iswData.iswName}
              </Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: '10px', marginBottom: '8px' }}>
              <strong style={{ marginLeft: '4px' }}>Incidents:</strong>
              <ul>
                {iswData.incidents
                  ? iswData.incidents.map((incident, index) => (
                      <li key={incident.id}>
                        <Typography variant="body1">
                          <strong>Incident Title:</strong> {incident.incidentTitle}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Incident Type:</strong> {incident.incidentType}
                        </Typography>
                      </li>
                    ))
                  : null}
              </ul>
            </Paper>
          </div>
        ) : (
          <DialogContentText>Loading incident solving way details...</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IswDetailsDialog;
