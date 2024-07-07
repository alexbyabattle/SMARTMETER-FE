import React, { useState, useEffect } from 'react';
import { Box, IconButton, Button, Snackbar } from '@mui/material';
import Header from "../../components/Header";
import axios from "axios";
import DeviceDialog from './DeviceDialog';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Delete } from "@mui/icons-material";
import DeviceEditDialog from './DeviceEditDialog';
import DeviceDetails from './DeviceDetails';
import DeleteDialog from './DeviceDeleteDialog';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const DeviceTable = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // handling opening and closing of IswDialog to submit the Isws

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDeviceDialog = () => {
    setIsDialogOpen(true);
  };

  // handling  populating the data after submitting

  const [rows, setRows] = useState([]);

  const loadDevices = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token  not found in local storage');
        return;
      }

      

      const response = await axios.get(`http://localhost:8082/api/v1/device/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const { data } = response.data;

      const formattedData = data.map((item) => ({
        id: item.id,
        deviceName: item.deviceName,
        deviceNumber: item.deviceNumber,
        manufactural: item.manufactural,
        status: item.status,
        

      }));

      setRows(formattedData);

      if (response.data.header.responseCode === 0) {
        showSnackbar(0, response.data.header.responseStatus);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(1, 'Error Message');
    }
  };


  useEffect(() => {
    loadDevices();
  }, []);


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

  // handling   delete  button  to be  able  to delete the  details

  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // To store the selected DEVICE ID for deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const handleDeleteClick = (deviceId) => {
    setSelectedDeviceId(deviceId);
    
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedDeviceId(null); // Reset the selected ISW ID
    loadDevices();
  };


   // handling  displaying of details


   const [selectedDeviceIdForDetails, setSelectedDeviceIdForDetails] = useState(null);
   const navigate = useNavigate();
 
 
 
   const openDeviceDetailsPage = (deviceId) => {
     if (deviceId) {
       setSelectedDeviceIdForDetails(deviceId);
       navigate(`/deviceDetails/${deviceId}`);
     }
   };

  // handling edit dialog 

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDeviceIdForEdit, setSelectedDeviceIdForEdit] = useState(null);

  
  const handleEditClick = (deviceId) => {
    setSelectedDeviceIdForEdit(deviceId);
    setIsEditDialogOpen(true);
  };

  const closeDeviceEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedDeviceIdForEdit(null);
  };   


  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "deviceName",
      headerName: "Device-Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "deviceNumber",
      headerName: "Device Number",
      flex: 1,
    },

    {
      field: "manufactural",
      headerName: "manufacturer",
      flex: 1,
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
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150, // Increase the width to cover all the actions
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton color="secondary" onClick={() => handleDeleteClick(row.id)}>
              <Delete style={{ color: "red" }} /> 
            </IconButton>
            <IconButton color="info" onClick={() =>handleEditClick (row.id)} >
              <EditOutlinedIcon />
            </IconButton>
            <IconButton color="success" onClick={() => openDeviceDetailsPage(row.id)} >
              <VisibilityOutlinedIcon style={{ color: "green" }} />
            </IconButton>
          </Box>
        );
      },
    },

  ];

  return (
    <Box >
    

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarColor }} // Set the background color based on snackbarColor
      />

      <DeviceDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        loadDevices={loadDevices}
        showSnackbar={showSnackbar}
      />

      <DeviceEditDialog
        deviceId={selectedDeviceIdForEdit}
        open={isEditDialogOpen}
        onClose={closeDeviceEditDialog}
        loadDevices={loadDevices}
        showSnackbar={showSnackbar}
      />

      <DeviceDetails
        id={selectedDeviceIdForDetails}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        deviceId={selectedDeviceId}
        loadDevices={loadDevices}
        showSnackbar={showSnackbar}
      />

      <Box
        style={{
          padding: 20,
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >
         <Header title="DEVICES " />

      <Box display="flex" justifyContent="start" mt="0px" sx={{ marginBottom: "5px" }}>
        <Button
          onClick={openDeviceDialog}
          color="secondary"
          variant="contained"
          sx={{ width: "120px", height: "25px" }}
        >
          ADD DEVICE
        </Button>
      </Box>

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

    </Box>
  );
};

export default DeviceTable;

