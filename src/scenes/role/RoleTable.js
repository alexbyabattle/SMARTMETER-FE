import React, { useState, useEffect } from 'react';
import { Box, IconButton, Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import RoleDialog from './RoleDialog';
import axios from 'axios';
import DeleteRoleDialog from './DeleteRoleDialog';


const RoleTable = () => {

  // handling opening and closing of IswDialog to submit the Isws

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openRoleDialog = () => {
    setIsDialogOpen(true);
  };

  // handling  populating the data after submitting
  const [rows, setRows] = useState([]);

  const loadRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/role');
      const { data } = response.data;
  
      const formattedData = data.map((item) => ({
        id: item.id,
        roleName: item.roleName,
        createdAt: item.createdAt,
        
      }));
  
      setRows(formattedData);
  
      if (response.data.header.responseCode === 0) {
        showSnackbar(0, response.data.header.responseStatus);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(1, 'Error Message'); // Example usage of showSnackbar with responseCode 1
    }
  };
  

  useEffect(() => {
    loadRoles();
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
  
  const [selectedRoleId, setSelectedRoleId] = useState(null); // To store the selected ISW ID for deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const handleDeleteClick = (id) => {
    setSelectedRoleId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedRoleId(null); // Reset the selected ISW ID
    loadRoles();
  };

  {/*  // handling  displaying of details

  const [roleDetailsDialogOpen, setRoleDetailsDialogOpen] = useState(false);
  const [selectedRoleIdForDetails, setSelectedRoleIdForDetails] = useState(null);

  const openRoleDetailsDialog = (id) => {
    setSelectedRoleIdForDetails(id);
    setRoleDetailsDialogOpen(true);
  };

  const closeRoleDetailsDialog = () => {
    setSelectedRoleIdForDetails(null);
    setRoleDetailsDialogOpen(false);
  };

  // handling edit dialog 

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoleIdForEdit, setSelectedRoleIdForEdit] = useState(null);

  
  const handleEditClick = (id) => {
    setSelectedRoleIdForEdit(id);
    setIsEditDialogOpen(true);
  };

  const closeRoleEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedRoleIdForEdit(null);
  };    */}


  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'roleName',
      headerName: 'RoleName',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'createdAt',
      headerName: 'created-At',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton 
              color="secondary"  
              onClick={() => handleDeleteClick(row.id)}
            >
                <Delete style={{ color: 'red' }} />
            </IconButton>

            <IconButton color="info" >
              <EditOutlinedIcon />
            </IconButton>

            <IconButton color="success"  >
              <VisibilityOutlinedIcon style={{ color: 'green' }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="0px">
      <Header title="ROLES AVAILABLE" />

      <Box display="flex" justifyContent="start" mt="20px">
        <Button
          onClick={openRoleDialog}
          color="secondary"
          variant="contained"
          sx={{ width: '100px', height: '30px' }}
        >
          ADD-ROLE
        </Button>
      </Box>

      <DeleteRoleDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        id={selectedRoleId}
        loadRoles={loadRoles}
        showSnackbar={showSnackbar}
      />
     
       
       

      <RoleDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        loadRoles={loadRoles}
        showSnackbar={showSnackbar} 
      />
 
           

      <Box m="0" height="72vh">
        <DataGrid rows={rows} columns={columns} />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarColor }} // Set the background color based on snackbarColor
      />
    </Box>
  );
};

export default RoleTable;
