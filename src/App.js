import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Home from "./scenes/Home/Home";
import DeviceTable from "./scenes/device/DeviceTable";
import UserTable from "./scenes/User/UserTable";
import IswTable from "./scenes/isw/IswTable";
import RoleTable from "./scenes/role/RoleTable";
import Register from "./scenes/Authentication/register";
import Login from "./scenes/Authentication/Login";
import DeviceDetails from "./scenes/device/DeviceDetails";
import UserDetails from "./scenes/User/UserDetails";
import IncidentTable from "./scenes/incident/IncidentTable";
import Request from "./scenes/Requests/request";
import ReportIncident from "./scenes/Reportpage/ReportIncident";
import RequestPage from "./scenes/Reportpage/RequestForm";
import IncidentDetails from "./scenes/incident/IncidentDetails";
import RequestDetails from "./scenes/incident/RequestDetails";
import EditIncidentDetails from "./scenes/incident/EditIncidentDetails";
import Incidents from "./scenes/Requests/Incidents";
import AdminRequest from "./scenes/incident/RequestTable";
import ReportForm from "./scenes/Reportpage/ReportForm";
import UserDashboard from "./scenes/UserDashboard/UserDashboard"; // Correct path to UserDashboard

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // Function to determine whether to display Sidebar
  const displaySidebar = () => {
    return !['/home', '/', '/register', '/reportForm' , '/userDashboard' , '/request' , '/viewRequest' ].includes(location.pathname);
  };

  // Function to determine whether to display toolbar
  const displayToolbar = () => {
    return !['/home', '/', '/register', '/incidentDetails/:id'].includes(location.pathname);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {displaySidebar() && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {displayToolbar() && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/userDashboard" element={<UserDashboard />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/deviceDetails/:id" element={<DeviceDetails />} />
              <Route path="/userDetails/:id" element={<UserDetails />} />
              <Route path="/device" element={<DeviceTable />} />
              <Route path="/user" element={<UserTable />} />
              <Route path="/isw" element={<IswTable />} />
              <Route path="/role" element={<RoleTable />} />
              <Route path="/edit/:id" element={<EditIncidentDetails />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/incidentDetails/:id" element={<IncidentDetails />} />
              <Route path="/requestDetails/:id" element={<RequestDetails />} />
              <Route path="/report" element={<ReportIncident />} />
              <Route path="/reportForm" element={<ReportForm />} />
              <Route path="/request" element={<RequestPage />} />
              <Route path="/viewRequest" element={<Request />} />
              <Route path="/allRequest" element={<AdminRequest />} />
              <Route path="/incident" element={<IncidentTable />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/form" element={<Form />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />

              {/* Redirect to login if path is not recognized */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
