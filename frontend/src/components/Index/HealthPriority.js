// componenets/HealthPriority.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const HealthPriority = ({ onHealthReportDialogOpen }) => {
  return (
    <Container sx={{ my: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom fontWeight='bold'>
        Your Health, Our Priority
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        We care about your health. Click the button below to get your health report.
      </Typography>
      <Button variant="contained" color="primary" onClick={onHealthReportDialogOpen}>
        Get Health Report
      </Button>
    </Container>
  );
};

export default HealthPriority;
