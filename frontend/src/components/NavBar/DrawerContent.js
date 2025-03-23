// src/components/DrawerContent.js
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Switch, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Info as InfoIcon, Mail as MailIcon } from '@mui/icons-material';

const DrawerContent = ({ darkMode, handleDarkModeToggle, toggleDrawer }) => {
  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/aqi">
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary="AQI" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><MailIcon /></ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Dark Mode" />
          <Switch checked={darkMode} onChange={handleDarkModeToggle} />
        </ListItem>
      </List>
    </Box>
  );
};

export default DrawerContent;
