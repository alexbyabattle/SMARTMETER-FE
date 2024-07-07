import React, { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const UserDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate('/request');
  };

  const handleViewClick = () => {
    navigate('/viewRequest');
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="welcome  to  SMARTMETER MANAGEMENT SYSTEM" />
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header  subtitle="1 UNIT =  200Tsh" />
      </Box>


      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="SMART-METER"
            subtitle="Buy  Units "
            increase="24hrs"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            button={
              <Button variant="contained" color="secondary" onClick={handleReportClick}>
                BUY 
              </Button>
            }
          />
        </Box>
        <Box
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="SMART-METER"
            subtitle="view  your  requests"
            increase="24hrs"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            button={
              <Button variant="contained" color="secondary" onClick={handleViewClick}>
                VIEW 
              </Button>
            }
          />
        </Box>
        
      </Box>
    </Box>
  );
};

export default UserDashboard;
