import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Snackbar } from '@mui/material';
import { DataGrid , GridToolbar } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import axios from 'axios';
import EditRequestDetailsDialog from './EditRequestDetailsDialog';
import { Formik } from 'formik';
import RequestDetailsDialog from './RequestDetailsDialog';
import DeleteDialog from '../incident/DeleteIncidentDialog';



const Request = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
 
  

  
    

  const loadIncidents = async () => {
    try {
      
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken || !userId) {
        console.error('Access token or user ID not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(`http://localhost:8084/api/incident/user/${userId}`, config);

      const responseData = response.data;
      const formattedData = responseData.data
        
        .map((item) => ({
          id: item.id,
          amount: item.amount,
          createdAt: item.createdAt,
          status: item.status,
          unit: item.unit,
          
        
        }));
      setRows(formattedData);
      if (responseData.header.responseCode === '0') {
        showSnackbar(0, responseData.header.responseStatus);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(1, 'Error Message');
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode);
    setSnackbarOpen(true);
  };

  const handleDeleteClick = (incidentId) => {
    setSelectedIncidentId(incidentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedIncidentId(null);
    loadIncidents();
  };

  

  // handling  displaying of details

  const [incidentDetailsDialogOpen, setIncidentDetailsDialogOpen] = useState(false);
  const [selectedIncidentIdForDetails, setSelectedIncidentIdForDetails] = useState(null);

  const openIncidentDetailsDialog = (incidentId) => {
    setSelectedIncidentIdForDetails(incidentId);
    setIncidentDetailsDialogOpen(true);
  };

  const closeIncidentDetailsDialog = () => {
    setSelectedIncidentIdForDetails(null);
    setIncidentDetailsDialogOpen(false);
  }; 

  // handling edit dialog 

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIncidentIdForEdit, setSelectedIncidentIdForEdit] = useState(null);

  
  const handleEditClick = (incidentId) => {
    setSelectedIncidentIdForEdit(incidentId);
    setIsEditDialogOpen(true);
  };

  const closeIncidentEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedIncidentIdForEdit(null);
  };   

  
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'amount', headerName: 'AMOUNT', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'createdAt', headerName: 'createdAt', flex: 1, cellClassName: 'name-column--cell' },
    
    { field: 'unit', headerName: 'UNITS', flex: 1, cellClassName: 'name-column--cell' },
    {
      field: "status",
      headerName: "status",
      flex: 1,
      renderCell: ({ row }) => {
        let statusColor;
        let textColor;
        if ([ "RECEIVED"].includes(row.status)) {
          statusColor = "#4CAF50";
          textColor = "#FFFFFF";
        } else if (["PENDING", "FAULT", "SOLUTION_PENDING", "IN_ACTIVE"].includes(row.status)) {
          statusColor = "#f44336";
          textColor = "#FFFFFF";
        } else {
          statusColor = "#FFFFFF";
          textColor = "#000000";
        }
        return (
          <Box bgcolor={statusColor} color={textColor} p={1} borderRadius={5}>
            {row.status}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton color="secondary" onClick={() => handleDeleteClick(row.id)}>
              <Delete style={{ color: "red" }} />
            </IconButton>
            <IconButton color="info" onClick={() =>handleEditClick (row.id)} >
              <EditOutlinedIcon />
            </IconButton>
            <IconButton color="success" onClick={() => openIncidentDetailsDialog(row.id)} >
              <VisibilityOutlinedIcon style={{ color: "green" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="0px">
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        incidentId={selectedIncidentId}
        loadIncidents={loadIncidents}
        showSnackbar={showSnackbar}
      />

      <RequestDetailsDialog
        id={selectedIncidentIdForDetails}
        open={incidentDetailsDialogOpen}
        onClose={closeIncidentDetailsDialog}
      />  
       
      <EditRequestDetailsDialog
        id={selectedIncidentIdForEdit}
        open={isEditDialogOpen}
        onClose={closeIncidentEditDialog}
        loadIncidents={loadIncidents}
      />     

      <Box
        style={{
          padding: 20,
          marginLeft: '20px',
          marginRight: '20px'
        }}
      > 
        <Header title="REQUESTS" />
        <Box
          m="0"
          height="72vh"
          sx={{
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            disableRowSelectionOnClick
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
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

export default Request;
