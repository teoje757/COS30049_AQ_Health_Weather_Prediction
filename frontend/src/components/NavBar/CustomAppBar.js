import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button, Badge, Menu, MenuItem } from '@mui/material';
import { Notifications, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { UserContext } from './UserContext';

import SearchLocation from './SearchLocation';

const CustomAppBar = ({ drawerToggle, darkMode, handleDarkModeToggle, userName, anchorEl, setAnchorEl, loggedIn, setLoggedIn, weatherData }) => {
  const { user } = useContext(UserContext); // Use UserContext here

  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Get the navigate function

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountClick = () => {
    handleMenuClose(); // Close the menu
    navigate('/Account'); // Navigate to the Account page
  };

  // Function to determine weather emoji based on temperature
  const getWeatherEmoji = (temp) => {
    if (temp >= 7 && temp <= 18) {
      return '🌧️'; // Rainy
    } else if (temp > 18 && temp <= 21) {
      return '☁️'; // Cloudy
    } else if (temp > 25) {
      return '☀️'; // Sunny
    } else if (temp >= 16 && temp <= 25) {
      return '🌤️'; // Partly Cloudy
    }
    return '❓'; // Unknown weather
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: darkMode ? '#333' : '#fafafa', height: 80 }}>
      <Toolbar sx={{ justifyContent: 'space-between', height: 80 }}>
        {/* Left Section: Weather and Menu Icon */}
        <Box display="flex" alignItems="center">
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={drawerToggle}>
            <MenuIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: 'white', mr: 2 }}>
            {weatherData?.temperature !== undefined ? getWeatherEmoji(weatherData.temperature) : '❓'}
          </Avatar>
          <Typography variant="body1" color="textPrimary">
            {weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : 'Loading...'}, AQI: {weatherData?.aqi !== undefined ? weatherData.aqi : 'Loading...'}
          </Typography>
        </Box>
        {/* Center Section: Logo with Links */}
        <Box display="flex" alignItems="center" gap={4}>
          <Button color="textPrimary" component={Link} to="/health">HEALTH INSIGHTS</Button>
          <Button to="/" component={Link} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/images/logo.png" alt="App Logo" style={{ height: '40px', cursor: 'pointer' }} />
          </Button>
          <Button color="inherit" component={Link} to="/aqi">AQI</Button>
        </Box>
        {/* Right Section: Icons and User Menu */}
        <Box display="flex" alignItems="center">
          <SearchLocation />

          <IconButton aria-label="show 4 new notifications">
            <Badge badgeContent={3} color="error">
              <Notifications sx={{ color: '#06CE88' }} />
            </Badge>
          </IconButton>

          <Button
            color="inherit"
            startIcon={<AccountCircle />}
            onClick={handleAccountClick} // Updated to use the new click handler
            sx={{ color: '#06CE88', ml: 1 }}
          >
          </Button>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Welcome, {user?.firstName}!
            </Typography>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={() => {
              setLoggedIn(!loggedIn);
              handleMenuClose();
            }}>
              {loggedIn ? 'Logout' : 'Login'}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      {/* Underline for active page */}
      <Box sx={{ height: '2px', bgcolor: '#06CE88', visibility: ['/', '/health', '/aqi'].includes(location.pathname) ? 'visible' : 'hidden' }} />
    </AppBar>
  );
};

export default CustomAppBar;