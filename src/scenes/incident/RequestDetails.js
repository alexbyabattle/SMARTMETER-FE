import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    IconButton,
    Snackbar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { AddToQueue, AddCard, ChangeCircle } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import MyFormDialog from './IncidentAssignmentDialog';
import IswToIncident from './IswToIncidentassignmentDialog';
import ChangeRequestStatusDialog from './ChangeRequestStatusDialog';
import { useTheme } from '@mui/material';
import image from '../../data/image';


const RequestDetails = () => {

    const theme = useTheme();
    const borderColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000';

    const { id } = useParams(); // Extract the id parameter from the route

    const [incidentData, setIncidentData] = useState(null);

    const getAuthConfig = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Access token not found in local storage');
            return {};
        }
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
    };

    const loadIncidentDetails = () => {
        console.log('Fetching incident details for ID:', id);

        // Verify the Axios GET request payload
        axios
            .get(`http://localhost:8084/api/incident/get/${id}`, getAuthConfig())
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


    // handling opening and closing of IncidentASsignment to admin  Dialog  
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openIncidentAssignmentDialog = (incidentId) => {
        setIsDialogOpen(true);
    };


    // handling opening and closing of solving way to incident Dialog  

    const [isIswToIncidentDialogOpen, setIsIswToIncidentDialogOpen] = useState(false);

    const openIncidentSolvingWayDialog = (incidentId) => {
        setIsIswToIncidentDialogOpen(true);
    };


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

        <Box
            elevation={3}

        >
            {incidentData && (
                <Box
                    elevation={3}
                    //height="200px"
                    sx={{
                        padding: '5px',
                        marginBottom: '8px',
                        border: `1px solid ${borderColor}`,
                        marginLeft: "3px",
                        marginRight: "3px",
                    }}

                >

                    <Box
                        height="100px"
                        sx={{
                            padding: 0,
                            border: `1px solid ${borderColor}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                        }}
                    >
                        <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 0, overflow: 'hidden' }}>
                            <img
                                alt="gcla admin"
                                width="100%"
                                height="100px"
                                src={image.smartmeter}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h5" align="center"> <h1>REQUEST DETAILS</h1></Typography>
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
                            <Typography variant="h6" align="center">ID: {incidentData.id} </Typography>
                            <Typography variant="h6" align="center">DATE: {incidentData.createdAt} </Typography>
                        </Box>


                    </Box>

                    <Box
                        elevation={3}
                        //height="200px"
                        sx={{
                            padding: '5px',
                            marginBottom: '2px',
                            border: `1px solid ${borderColor}`,
                            marginLeft: "3px",
                            marginRight: "3px",
                            display: 'flex',
                            flexDirection: 'row' 
                        }}

                    >
                        <Box flex="1" marginRight="16px">
                            <strong style={{ marginLeft: '4px', marginRight: '15px' }}>   REQUESTS:  </strong>
                            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                <strong style={{ marginRight: '10px' }}  >AMOUNT:</strong> {incidentData.amount}
                            </Typography>
                            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                <strong style={{ marginRight: '10px' }} >UNITS :  </strong> {incidentData.unit}
                            </Typography>
                            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                <strong style={{ marginRight: '1px' }}> status: </strong>
                                <Box
                                    bgcolor={
                                        ["RECEIVED",].includes(incidentData.status)
                                            ? "#4CAF50"
                                            : ["Pending", "FAULT", "PENDING", "SOLUTION_PENDING", "In_Active"].includes(incidentData.status)
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
                                                <strong style={{ marginRight: '10px' }} > Meter-number: </strong> {user.department}
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


            <ChangeRequestStatusDialog
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

        </Box>
    );
};

export default RequestDetails;
