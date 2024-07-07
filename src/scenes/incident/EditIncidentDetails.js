import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Snackbar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { AddToQueue, AddCard, ThumbUpOffAlt, ChangeCircle } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import MyFormDialog from './IncidentAssignmentDialog';
import IswToIncident from './IswToIncidentassignmentDialog';


const EditIncidentDetails = () => {
  const { id } = useParams(); // Extract the id parameter from the route

  const [incidentData, setIncidentData] = useState(null);

  const loadIncidentDetails = () => {
    console.log('Fetching incident details for ID:', id);

    // Verify the Axios GET request payload
    axios
      .get(`http://localhost:8082/api/v1/incident/${id}`)
      .then((response) => {
        console.log('Response data:', response.data); // Log response data
        // Extract the "data" field from the response
        const { data } = response.data;
        setIncidentData(data);
      })
      .catch((error) => {
        console.error('Error fetching incident details:', error);
        // Log the entire error object for more information
        console.error('Full error object:', error);
      });
  };

  useEffect(() => {
    loadIncidentDetails();
  }, [id]);


  // handling opening and closing of IncidentASsignment  Dialog  to submit the Incident
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openIncidentAssignmentDialog = (incidentId) => {
    setIsDialogOpen(true);
  };


  // handling opening and closing of IncidentASsignment  Dialog  to submit the Incident

  const [isIswToIncidentDialogOpen, setIsIswToIncidentDialogOpen] = useState(false);

  const openIncidentSolvingWayDialog = (incidentId) => {
    setIsIswToIncidentDialogOpen(true);
  };


  // handling  opening and closing of SnackBar 

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success'); // Default snackbar color is 'success'

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    // Determine snackbar color based on responseCode
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode);
    setSnackbarOpen(true);
  };


  return (

    <Box>
      {incidentData && (
        <Box elevation={3}  bgcolor="#0D1825"  sx={{ padding: '10px', marginBottom: '8px' }}>

          <Box display="flex"  >

              <Box flex="1" marginRight="16px"  justifyContent="column">

              <Tooltip title="Assign Admin Incident">
                <IconButton color="success" onClick={() => openIncidentAssignmentDialog(incidentData.id)}>
                  <AddToQueue style={{ color: "white", fontSize: 32 }} />
                </IconButton>
              </Tooltip>
             <ul> 
              <strong style={{ marginLeft: '4px', marginRight: '15px' }}> INCIDENTS:  </strong>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                <strong style={{ marginRight: '10px' }}  >INCIDENT TITLE:</strong> {incidentData.incidentTitle}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                <strong style={{ marginRight: '10px' }} >INCIDENT TYPE :  </strong> {incidentData.incidentType}
              </Typography>
              <Typography variant="body1">
                <strong style={{ marginRight: '10px' }}> status: </strong>
                <Box
                  bgcolor={
                    ["FINE", "Active", "Solved", "Provided", "Approved"].includes(incidentData.status)
                      ? "#4CAF50"
                      : ["Pending", "FAULT", "PENDING", "Solution_Pending", "In_Active"].includes(incidentData.status)
                        ? "#f44336"
                        : "#FFFFFF"
                  }
                  color="#FFFFFF"
                  p={1}
                  borderRadius={15}
                  width={80}
                  height={40}
                  display="inline-flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ marginLeft: 10 }}

                  component="span"
                >
                  {incidentData.status}
                </Box>
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                <strong style={{ marginRight: '10px' }}> SUBMITTED AT :</strong> {incidentData.createdAt}
              </Typography>
             </ul> 
            </Box>


            <Box flex="1" justifyContent="column">

             <Tooltip title="Assign Admin Incident">
                <IconButton color="success" onClick={() => openIncidentAssignmentDialog(incidentData.id)}>
                  <AddToQueue style={{ color: "white", fontSize: 32 }} />
                </IconButton>
              </Tooltip>

              
              <ul>
                <strong style={{ marginLeft: '4px' }}>DEVICES:</strong>
                {incidentData.devices.map((device, index) => (
                  <li key={index}>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} >deviceName:</strong> {device.deviceName}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} > deviceNumber: </strong> {device.deviceNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} > manufactural: </strong> {device.manufactural}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}> status: </strong>
                      <Box
                        bgcolor={
                          ["FINE", "Active", "Solved", "Provided", "Approved"].includes(device.status)
                            ? "#4CAF50"
                            : ["Pending", "FAULT", "PENDING", "Solution_Pending", "In_Active"].includes(device.status)
                              ? "#f44336"
                              : "#FFFFFF"
                        }
                        color="#FFFFFF"
                        p={1}
                        borderRadius={15}
                        width={80}
                        height={40}
                        display="inline-flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ marginLeft: 10 }}

                        component="span"
                      >
                        {device.status}
                      </Box>
                    </Typography>

                  </li>
                ))}
              </ul>
            </Box>

          </Box>
        </Box>
      )}


      



      <MyFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        loadIncidentDetails={loadIncidentDetails}
        selectedIncidents={[id]}
        showSnackbar={showSnackbar}
      />

      <IswToIncident
        open={isIswToIncidentDialogOpen}
        onClose={() => setIsIswToIncidentDialogOpen(false)}
        loadIncidentDetails={loadIncidentDetails}
        selectedIncidents={[id]}
        showSnackbar={showSnackbar}
      />

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

export default EditIncidentDetails;
