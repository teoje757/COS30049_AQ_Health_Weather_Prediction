import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Typography, Badge, Container, Grid, Grow, Card, CardContent, CardMedia, Button, Box,
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
  Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, CssBaseline, CircularProgress, LinearProgress, Chip, Avatar, Divider, Menu, MenuItem
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// FOOTER
import Footer from './components/Footer/Footer'; 
import ContactDialog from './components/Footer/ContactDialog';
import HealthReportDialog from './components/Index/healthReportDialog';
import InteractiveMap from './components/Index/InteractiveMap';

// INDEX
import TipsCard from './components/Index/TipsCard';
import AirPollutionWarning from './components/Index/AirPollutionWarning';
import HeroSection from './components/Index/HeroSection';  
import HealthPriority from './components/Index/HealthPriority';

import CustomAppBar from './components/NavBar/CustomAppBar'; 
import DrawerContent from './components/NavBar/DrawerContent';

// HEALTH
import HealthTipsComponent from './components/Health/Health';

// AQI
import AQI from './components/AQI/AQI';

// User Account
import Account from './components/Account/Account';

// To retain username
import { UserProvider } from './components/NavBar/UserContext';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userHealthConditions, setUserHealthConditions] = useState(['Asthma']); // Sample health condition
  const [userLocation, setUserLocation] = useState({ lat: 34.0522, lng: -118.2437 }); // Los Angeles
  const [healthReportDialogOpen, setHealthReportDialogOpen] = useState(false);
  const [userName, setUserName] = useState('');

  // Contact form state
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Theme Definitions
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#06CE88' },
      text: { primary: '#000' },
      background: { default: '#fafafa' },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#06CE88' },
      text: { primary: '#ffffff' },
      background: { default: '#333' },
    },
  });

  // FUNCTIONS
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleHealthReportDialogOpen = () => {
    setHealthReportDialogOpen(true);
  };

  const handleHealthReportDialogClose = () => {
    setHealthReportDialogOpen(false);
  };

  const drawerContent = (
    <DrawerContent 
      darkMode={darkMode}
      handleDarkModeToggle={handleDarkModeToggle}
      toggleDrawer={toggleDrawer}
    />
  );

  // SUBMIT FORM
  const handleHealthReportSubmit = async (reportData) => {
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/healthReport', reportData);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting health report:', error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleHealthReportDialogClose();
    }
  };

  // SUBMIT CONTACT FORM
  const handleContactFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!contactEmail || !contactMessage) {
      alert('Email and message cannot be empty');
      return;
    }
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/contact', {
        email: contactEmail,
        message: contactMessage
      });
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleDialogClose();
      setContactEmail('');
      setContactMessage('');
    }
  };

  // TEMP & AQI
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    aqi: null
  });

  // FETCH TEMP & AQI
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/predict_aqi_temperature', {});
        const { predicted_temperature, predicted_aqi } = response.data;

        setWeatherData({
          temperature: predicted_temperature,
          aqi: predicted_aqi
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();

    // Optionally set up polling as needed
    const interval = setInterval(fetchWeatherData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  // NEW 
  useEffect(() => {
    // Get user's location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Handle error or use default location
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fall back to a sample location
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);
  
  return (
    <UserProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pt: 10,
        bgcolor: darkMode ? 'grey.900' : 'background.default', color: darkMode ? 'common.white' : 'common.black' }}>
          <CustomAppBar 
            drawerToggle={toggleDrawer(true)} 
            darkMode={darkMode} 
            handleDarkModeToggle={handleDarkModeToggle} 
            userName={userName} 
            anchorEl={anchorEl} 
            setAnchorEl={setAnchorEl} 
            loggedIn={loggedIn} 
            setLoggedIn={setLoggedIn}
            weatherData={weatherData} // Pass weather data here
          />
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
            <Routes>
              <Route path="/" element={
                <Container component="main" sx={{ mb: 2, flex: 1, overflowX: 'hidden', padding: 0 }}>
                  {/* Hero Section */}
                  <HeroSection />
                
                  {/* Tips Cards Section */}
                  <TipsCard />

                  {/* Air Pollution Warning Component */}
                  <AirPollutionWarning />

                  {/* Interactive Map */}
                  <InteractiveMap />

                  {/* Pass the open state and handleClose function */}
                  <HealthPriority onHealthReportDialogOpen={handleHealthReportDialogOpen} />

                </Container>
              }/>

              <Route path="/health" element={
                <HealthTipsComponent userLocation={userLocation} userHealthConditions={userHealthConditions} aqiData={weatherData.aqi} />
              } />
              <Route path="/aqi" element={<AQI />} />
              <Route path="/account" element={<Account userName={userName} onCheckHealth={handleHealthReportDialogOpen} />} />
             
            </Routes>

          {/* Footer */}
          <Footer handleDialogOpen={handleDialogOpen} />

          {/* Snackbar for feedback */}
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              Action completed successfully!
            </Alert>
          </Snackbar>

          {/* Contact Dialog */}
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogContent>
              <DialogContentText>
                If you have any questions or feedback, please fill out the form below.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <TextField
                margin="dense"
                id="message"
                label="Message"
                type="text"
                fullWidth
                variant="standard"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleContactFormSubmit(e);
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleContactFormSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>

          {/* Health Report Dialog */}
          <HealthReportDialog 
            open={healthReportDialogOpen} 
            onClose={handleHealthReportDialogClose} 
            onSubmit={handleHealthReportSubmit} 
          />

          <CssBaseline />
        </Box>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
