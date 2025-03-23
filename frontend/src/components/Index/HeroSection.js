// HeroSection.js
import React from 'react';
import { Box, Link, Container, Typography, Button } from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(/images/heroimage.jpg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        width: '100v%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          color: 'white',
          padding: 3,
          mx: 5,
          maxWidth: '600px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: dark overlay for readability
        }}
      >
        {/* Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: 'serif',
            fontSize: { xs: '3rem', sm: '3.5rem', md: '5rem' },
            fontWeight: 'bold',
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          Learn How To<br />
          Protect<br />
          Your Air
        </Typography>

        {/* Paragraph */}
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.2rem',
            mb: 4,
          }}
        >
          Discover valuable tips and expert advice to help you and your loved ones breathe easier and stay protected in any environment.
        </Typography>

        {/* Button */}
        <Button
          variant="contained"
          color="primary"
          component={Link} // Use Link component for navigation
          href="https://www.unep.org/explore-topics/air/what-we-do/monitoring-air-quality/how-we-can-improve-air-quality" // Replace with your desired URL
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Security best practice
          sx={{
            borderRadius: '25px',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            textTransform: 'none',
          }}
        >
          Learn More
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
