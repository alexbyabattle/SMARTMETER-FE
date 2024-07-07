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
import DeleteDialog from './DeleteIncidentDialog';
import IncidentDetails from './IncidentDetails';
import EditIncidentDetails from './EditIncidentDetails';
import { useNavigate } from 'react-router-dom';

const AdminRequest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIncidentIdForDetails, setSelectedIncidentIdForDetails] = useState(null);
  const [selectedIncidentIdForEditing, setSelectedIncidentIdForEditing] = useState(null);
  const navigate = useNavigate();

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

  const loadIncidents = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get('http://localhost:8084/api/incident/list', config);
      const responseData = response.data;
      const formattedData = responseData.data
        
        .map((item) => ({
          id: item.id,
          amount: item.amount,
          unit: item.unit,
          createdAt : item.createdAt,
          status: item.status,
          userName: item.users.map((user) => user.userName).join(', '),
          phoneNumber: item.users.map((user) => user.phoneNumber).join(', '),
          location: item.users.map((user) => user.location).join(', '),
          department: item.users.map((user) => user.department).join(', '),
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

  const openIncidentDetailsPage = (incidentId) => {
    if (incidentId) {
      setSelectedIncidentIdForDetails(incidentId);
      navigate(`/requestDetails/${incidentId}`);
    }
  };

  const openEditIncidentPage = (incidentId) => {
    if (incidentId) {
      setSelectedIncidentIdForEditing(incidentId);
      navigate(`/edit/${incidentId}`);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'amount', headerName: 'AMOUNT', flex: 1, cellClassName: 'name-column--cell' } ,
    { field: 'unit', headerName: 'UNITS', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'createdAt', headerName: 'createdAt', flex: 1, cellClassName: 'name-column--cell' },
    
    {
      field: "status",
      headerName: "status",
      flex: 1,
      renderCell: ({ row }) => {
        let statusColor;
        let textColor;
        if (["RECEIVED", ].includes(row.status)) {
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
            
            <IconButton color="success" onClick={() => openIncidentDetailsPage(row.id)} >
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
      <IncidentDetails id={selectedIncidentIdForDetails} />
      <EditIncidentDetails id={selectedIncidentIdForEditing} />
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

export default AdminRequest;
