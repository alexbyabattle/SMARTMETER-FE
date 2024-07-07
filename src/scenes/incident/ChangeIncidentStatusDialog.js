import React from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Box,

} from '@mui/material';

const dialogContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80px',
};

function ChangeIncidentStatusDialog({ open, onClose, incidentId, showSnackbar, loadIncidentDetails ,  incidentData , loadIncidents  }) {

    const updateIncidentStatus = () => {
        // Check if incidentData contains data
        console.log('Incident Data:', incidentData);

        const updateStatusEndpoint = `http://localhost:8082/api/incident/status/${incidentId}`;

        // Define the payload to be sent with the PUT request
        const payload = {
            id: incidentId,
            status: incidentData.status === 'PENDING' ? 'SOLVED' : 'PENDING'

        };


        // Make an HTTP PUT request to update the device status
        axios
            .put(updateStatusEndpoint, payload)
            .then((response) => {
                // Handle the success response (e.g., update UI)
                console.log('Device status updated successfully');

                // Determine snackbar color and message based on the response code
                const responseCode = response.data.header.responseCode;
                const responseStatus = response.data.header.responseStatus;

                if (responseCode === 0) {
                    showSnackbar('success', responseStatus);
                } else {
                    showSnackbar('error', responseStatus);
                }
                // Close the dialog
                loadIncidentDetails();
                loadIncidents();
                onClose();
            })
            .catch((error) => {
                // Handle any errors (e.g., show an error message)
                console.error('Error updating incident status:', error);
                console.error('Response data:', error.response?.data);
                // Close the dialog
                onClose();
            });
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogContent style={dialogContentStyle}>
                <Typography variant="body1">
                     do  you  want  to confirm the  request ?
                </Typography>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Box display="flex" justifyContent="center" mt="20px">
                    <Button onClick={updateIncidentStatus} color="error" variant="contained">
                        OK
                    </Button>
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                    <Button onClick={onClose} color="secondary" variant="contained">
                        Cancel
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default ChangeIncidentStatusDialog;
