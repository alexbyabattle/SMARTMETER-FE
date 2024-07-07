import React, { useState, useEffect } from 'react';
import { Box, IconButton, Snackbar } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import axios from 'axios';
import DeleteDialog from '../incident/DeleteIncidentDialog';
import IncidentDetailsDialog from './IncidentDetailsDialog';
import EditRequestDetailsDialog from './EditRequestDetailsDialog';
import ChangeIncidentStatusDialog from '../incident/ChangeIncidentStatusDialog';


const Incidents = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // handling  populating the data after submitting
  const [rows, setRows] = useState([]);

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

      const response = await axios.get(`http://localhost:8082/api/incident/list/${userId}`, config);

      const responseData = response.data;

      const formattedData = responseData.data ? responseData.data
        .filter((item) => ['software', 'hardware'].includes(item.incidentType.toLowerCase()))
        .map((item) => ({
          id: item.id,
          incidentTitle: item.incidentTitle,
          incidentType: item.incidentType,
          status: item.status,
          deviceName: item.devices.map((device) => device.deviceName).join(', '),
          deviceNumber: item.devices.map((device) => device.deviceNumber).join(', '),

        })) : [];

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



  // handling  opening and closing of SnackBar 

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    // Determine snackbar color based on responseCode
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode);
    setSnackbarOpen(true);
  };


  // handling   delete  button  to be  able  to delete the  details

  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const handleDeleteClick = (incidentId) => {
    setSelectedIncidentId(incidentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedIncidentId(null); // Reset the selected ISW ID
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

    {
      field: 'incidentTitle',
      headerName: 'Incident Title',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'incidentType',
      headerName: 'Incident Type',
      flex: 1,
      cellClassName: 'name-column--cell',
    },

    {
      field: 'deviceName',
      headerName: 'deviceName',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'deviceNumber',
      headerName: 'deviceNumber',
      flex: 1,
      cellClassName: 'name-column--cell',
    },

    {
      field: "status",
      headerName: "status",
      flex: 1,
      renderCell: ({ row }) => {
        let statusColor;
        let textColor;


        if (["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(row.status)) {
          statusColor = "#4CAF50"; // Green for success statuses
          textColor = "#FFFFFF"; // Text color white for success statuses
        } else if (["PENDING", "FAULT", "SOLUTION_PENDING", "IN_ACTIVE"].includes(row.status)) {
          statusColor = "#f44336"; // Red for error status
          textColor = "#FFFFFF"; // Text color white for error statuses
        } else {
          statusColor = "#FFFFFF"; // Default background color
          textColor = "#000000"; // Default text color
        }

        return (
          <Box
            bgcolor={statusColor}
            color={textColor}
            p={1}
            borderRadius={5}
          >
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

            <IconButton color="info" onClick={() => handleEditClick(row.id)} >
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

      <IncidentDetailsDialog
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

      <ChangeIncidentStatusDialog
        loadIncidents={loadIncidents}
      />


      <Box
        style={{
          padding: 20,
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >

        <Header title="INCIDENTS " />
        <Box
          m="0"
          height="72vh"
          sx={{
            "& .MuiDataGrid-root": {
              color: theme.palette.mode === 'light' ? '#000000' : undefined, // Set text color to black in light mode
              border: theme.palette.mode === 'light' ? '1px solid #000000' : undefined, // Set border color to black in light mode
            },
            "& .MuiDataGrid-row": {
              borderBottom: theme.palette.mode === 'light' ? '1px solid #000000' : undefined, // Set border between each row to black in light mode
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[0]} !important`,
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


export default Incidents;
