import React, { useState } from 'react'; // Import useState
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  Button,
  IconButton,
  Link
} from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import ContactDialog from './ContactDialog';

const Footer = () => {
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog open/close

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box component="footer" sx={{ p: 4, bgcolor: (theme) => theme.palette.background.default, color: (theme) => theme.palette.text.primary }}>
      <Container>
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo and Contact Section */}
          <Grid item xs={12} sm={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Avatar src='/images/logo.png' alt="App Logo" sx={{ width: 56, height: 56, mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black'  }}>
                  AQI
                  <span style={{ color: '#00CD85' }}>Health</span>
                </Typography>
              </Link>  
            </Box>
            <Button onClick={handleDialogOpen} 
              sx={{ bgcolor: 'grey.400', borderRadius: '16px', color: 'black', 
                '&:hover': {bgcolor: 'grey.500',},textTransform: 'none' }}> Contact Us
            </Button>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Quick Links</Typography>
            <Box display="flex" flexDirection="column">
              <Link to="/aqi" style={{ color: 'inherit', textDecoration: 'none' }}>Air Quality</Link>
              <Link to="/weather.html" style={{ color: 'inherit', textDecoration: 'none' }}>Weather</Link>
              <Link to="/health" style={{ color: 'inherit', textDecoration: 'none' }}>Health Tips</Link>
            </Box>
          </Grid>

          {/* Networks Link Section */}
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Networks</Typography>
            <Box display="flex" flexDirection="column">
              <Link to="/aqi" style={{ color: 'inherit', textDecoration: 'none' }}>London Lung Cancer Nurses Forum</Link>
              <Link to="/weather.html" style={{ color: 'inherit', textDecoration: 'none' }}>Respiratory Nurse Network</Link>
              <Link to="/health" style={{ color: 'inherit', textDecoration: 'none' }}>Pulmonary Rehabilitation Network</Link>
            </Box>
          </Grid>

          {/* Education Link Section */}
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Education</Typography>
            <Box display="flex" flexDirection="column">
              <Link to="/aqi" style={{ color: 'inherit', textDecoration: 'none' }}>Training</Link>
              <Link to="/weather.html" style={{ color: 'inherit', textDecoration: 'none' }}>Webinars</Link>
              <Link to="/health" style={{ color: 'inherit', textDecoration: 'none' }}>Cleanonferences</Link>
            </Box>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Connect With Us</Typography>
            <Box display="flex" justifyContent="flex-start" gap={2} mt={1}>
              <IconButton href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook" color="primary">
                <Facebook />
              </IconButton>
              <IconButton href="https://www.twitter.com" target="_blank" rel="noopener" aria-label="Twitter" color="primary">
                <Twitter />
              </IconButton>
              <IconButton href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram" color="primary">
                <Instagram />
              </IconButton>
              <IconButton href="https://www.linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" color="primary">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        {/* Copyright */}
        <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          © {new Date().getFullYear()} Your App Name. All rights reserved.
        </Typography>
      </Container>


      {/* Contact Dialog */}
      <ContactDialog open={dialogOpen} onClose={handleDialogClose} />
    </Box>
  );
};

export default Footer;
