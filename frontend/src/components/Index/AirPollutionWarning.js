// components/Index/AirPollutionWarning.js
import React from 'react';
import { Container, Typography, Grid } from '@mui/material';

const AirPollutionWarning = () => (
  <Container sx={{ mt: 8, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2, p: 4 }}>
    <Typography variant="h3" gutterBottom sx={{ fontWeight:'bold', color: '#f44336', mb: 4 }}>
      Air Pollution Can Be Deadly!
    </Typography>
    <Typography variant="body1" sx={{ mb: 4 }}>
      Exposure to air pollution can lead to serious health issues, including respiratory diseases, heart problems, and even premature death.
    </Typography>
    <Grid container justifyContent="center" sx={{ mb: 4 }}>
      <Grid item xs={12} sm={8}>
        <img
          src="/images/impactgraph.jpg"
          alt="Impact of Air Pollution on Health"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        />
      </Grid>
    </Grid>
    <Typography variant="body2" sx={{ mt: 5, mb: 2 }}>
      Information taken from: <a href="https://world-heart-federation.org/news/air-pollution-and-cardiovascular-disease-a-window-of-opportunity/?petition=close" target="_blank" rel="noopener noreferrer">World Heart Federation</a>
    </Typography>
  </Container>
);

export default AirPollutionWarning;
