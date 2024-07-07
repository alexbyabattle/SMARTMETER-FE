import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Snackbar,

} from '@mui/material';
import { ChangeCircle } from '@mui/icons-material';
import ChangeIncidentStatusDialog from '../incident/ChangeIncidentStatusDialog';



const IncidentDetailsDialog = ({ id, open, onClose }) => {

    const [incidentData, setIncidentData] = useState(null);

    const loadIncidentDetails = () => {
        console.log('Fetching incident details for ID:', id);

        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            console.error('Access token not found in local storage');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        // Verify the Axios GET request payload
        axios
            .get(`http://localhost:8084/api/incident/get/${id}`, config)
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





    // handling opening and closing of changing status of incident Dialog  


    const [isStatusOfIncidentDialogOpen, setIsStatusOfIncidentDialogOpen] = useState(false);

    const openStatusOfIncidentDialog = (incidentId) => {
        setIsStatusOfIncidentDialogOpen(true);
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle> TRANS  DETAILS </DialogTitle>
            <DialogContent>

                {incidentData && (
                    <Box elevation={3} display="flex" sx={{ padding: '10px', marginBottom: '8px' }}>

                        <Box display="flex">
                            <Box flex="1" marginRight="16px">
                                <strong style={{ marginLeft: '4px', marginRight: '15px' }}>  TRANSACTIONS  DETAILS:  </strong>
                                <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                    <strong style={{ marginRight: '10px' }}  >AMOUNT:</strong> {incidentData.amount}
                                </Typography>
                                <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                    <strong style={{ marginRight: '10px' }} >UNITS :  </strong> {incidentData.unit}
                                </Typography>
                                <Typography variant="body1">
                                    <strong style={{ marginRight: '10px' }}> status: </strong>
                                    <Box
                                        bgcolor={
                                            ["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(incidentData.status)
                                                ? "#4CAF50"
                                                : ["Pending", "FAULT", "PENDING", "SOLUTION_PENDING", "IN_ACTIVE"].includes(incidentData.status)
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
                            </Box>


                        

                            <Box flex="1" >
                                <ul>
                                    <strong style={{ marginLeft: '4px' }}>USER : </strong>
                                    {incidentData.users
                                        .filter(user => user.department !== 'IT')
                                        .map((user, index) => (
                                            <li key={index}>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }}>UserName:</strong> {user.name}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }} > phoneNumber: </strong> {user.phoneNumber}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }} > meter Number: </strong> {user.department}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }}> location: </strong> {user.location}
                                                </Typography>
                                            </li>
                                        ))}
                                </ul>
                            </Box>


                        </Box>
                    </Box>
                )}

                

                <ChangeIncidentStatusDialog
                    open={isStatusOfIncidentDialogOpen}
                    onClose={() => setIsStatusOfIncidentDialogOpen(false)}
                    incidentId={incidentData ? incidentData.id : null}
                    showSnackbar={showSnackbar}
                    loadIncidentDetails={loadIncidentDetails}
                    incidentData={incidentData}
                />

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                    sx={{ backgroundColor: snackbarColor }}
                />


            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IncidentDetailsDialog;
