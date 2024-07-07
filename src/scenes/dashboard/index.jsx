import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [responseMessage, setResponseMessage] = useState('');
  const [location, setLocation] = useState('');

  const fetchIncidentData = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/incident/list');
      const data = response.data.data; // Access the data array directly
  
      // Log all retrieved incidents
      console.log('All Retrieved Incidents:', data);
  
      if (data && data.length > 0) {
        // Get the createdAt time of the last incident in the array
        const lastIncident = data[data.length - 1];
        if (lastIncident && lastIncident.createdAt) {
          const lastCreatedAt = new Date(lastIncident.createdAt);
          console.log('Last Incident Created At:', lastCreatedAt);
  
          // Calculate 10 minutes before lastCreatedAt
          const tenMinutesAgo = new Date(lastCreatedAt.getTime() - 10 * 60000);
          console.log('Ten minutes before Last Incident Created At:', tenMinutesAgo);
  
          // Filter incidents that meet the criteria
          const filteredIncidents = data.filter(incident => {
            const incidentTime = new Date(incident.createdAt);
            // Check if incident falls between tenMinutesAgo and lastCreatedAt
            // Check if incidentType is "NETWORK"
            // Check if user role is "USER" and incident location matches user's location
            return (
              incidentTime >= tenMinutesAgo &&
              incidentTime <= lastCreatedAt &&
              incident.category === "NETWORK" &&
              incident.users.some(user => user.role === "USER" && user.location === incident.location)
            );
          });
  
          // Log filtered incidents
          console.log('Filtered Incidents within the last 10 minutes with criteria:');
          console.log(filteredIncidents);
        } 
      }
    } catch (error) {
      console.error('Error fetching incident data:', error);
    }
  };

  const userRole = localStorage.getItem('role');

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="SMART-METER DASHBOARD" subtitle="Welcome to SMARTMETER management system" />
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
            title="SMART METER"
            subtitle="By  units online"
            progress="1"
            increase="24hrs"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
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
            title="SMARTMETER"
            subtitle="see  all  your TRANSACTIONS "
            progress="1"
            increase="24hrs"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
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
            title="SMARTMETER"
            subtitle="be notified when units  are low"
            progress="1"
            increase="24hrs"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
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
            title="SMARTMETER"
            subtitle="enjoy  good  operations"
            progress="1"
            increase="24hrs"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        

      </Box>
    </Box>
  );
};

export default Dashboard;
