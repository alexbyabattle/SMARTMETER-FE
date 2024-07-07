import { Box, IconButton, useTheme, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Delete } from "@mui/icons-material";
import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";

import UserEditDialog from "./UserEditDialog";
import UserDetails from "./UserDetails";
import DeleteDialog from "./DeleteUserDialog";
import { tokens } from "../../theme";
import { useNavigate } from 'react-router-dom';



const UserTable = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // handling  populating the data after submitting'

  const [rows, setRows] = useState([]);

  const loadUsers = async () => {
    try {

      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token  not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios.get('http://localhost:8084/api/v1/users/all', config);
      const { data } = response.data;

      const formattedData = data.map((item) => ({
        id: item.id,
        userName: item.name,
        phoneNumber: item.phoneNumber,
        email: item.email,
        location: item.location,
        department: item.department,
        createdAt: item.createdAt,
        status: item.status,
        roleName: item.role,
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
    loadUsers();
  }, []);





  //  adding  add-user  dialog   and  submitting the form values

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFormSubmit = async (values) => {
    try {

      await axios.post("http://localhost:8082/api/user", values);
      loadUsers();
      handleDialogClose();
    } catch (error) {

    }
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



  // handling   delete  button  to be  able  to delete the  details

  const [selectedUserId, setSelectedUserId] = useState(null); // To store the selected DEVICE ID for deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const handleDeleteClick = (UserId) => {
    setSelectedUserId(UserId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId(null); // Reset the selected ISW ID
    loadUsers();
  };



  // handling   edit  button  to be  able  to edit the  details 

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  //const [selectedUserId, setSelectedUserId] = useState(null);


  const handleEditClick = (userId) => {
    setSelectedUserId(userId);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    // When the edit dialog is closed, refresh the list of devices
    setEditDialogOpen(false);
    setSelectedUserId(null);
    loadUsers();
  };


  // handling  displaying of details


  const [selectedUserIdForDetails, setSelectedUserIdForDetails] = useState(null);
  const navigate = useNavigate();



  const openUserDetailsPage = (userId) => {
    if (userId) {
      setSelectedUserIdForDetails(userId);
      navigate(`/userDetails/${userId}`);
    }
  };






  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "userName",
      headerName: "UserName",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "department",
      headerName: "department",
      flex: 1,
    },

    {
      field: "createdAt",
      headerName: "createdAt",
      flex: 1,
    },

    {
      field: "roleName",
      headerName: "roleName",
      flex: 1,
    },

    {
      field: "status",
      headerName: "status",
      flex: 1,
      renderCell: ({ row }) => {
        let statusColor;
        let textColor;


        if (["FINE", "Active", "SOLVED", "PROVIDED", "APPROVED"].includes(row.status)) {
          statusColor = "#4CAF50"; // Green for success statuses
          textColor = "#FFFFFF"; // Text color white for success statuses
        } else if (["PENDING", "FAULT", "SOLUTION_PENDING", "IN_ACTIVE"].includes(row.status)) {
          statusColor = "#f44336"; // Red for error status
          textColor = "#FFFFFF"; // Text color white for error statuses
        } else {
          statusColor = "#FFFFFF"; // Default background color
          textColor = "#000000";
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
              <Delete style={{ color: "red" }} /> {/* Adjust the color */}
            </IconButton>
            <IconButton color="info" onClick={() => handleEditClick(row.id)}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton color="success" onClick={() => openUserDetailsPage(row.id)} >
              <VisibilityOutlinedIcon style={{ color: "green" }} />
            </IconButton>
          </Box>
        );
      },
    },

  ];

  return (



    <Box m="0px">
      



      <UserDetails
        id={selectedUserIdForDetails}
      />


      <UserEditDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose} // Update this line
        userId={selectedUserId}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        userId={selectedUserId}
        loadUsers={loadUsers}
        showSnackbar={showSnackbar}
      />





      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarColor }} // Set the background color based on snackbarColor
      />

      <Box
        style={{
          padding: 20,
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >
         <Header title="USERS" />

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

export default UserTable;
