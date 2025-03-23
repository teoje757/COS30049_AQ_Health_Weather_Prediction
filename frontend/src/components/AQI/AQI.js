import React from 'react';
import { Box, Typography } from '@mui/material';
import AQIChart from './AQIChart';
import AirQualityTrendsChart from './AirQualityTrendsChart'; // New component for air quality trends chart
import { useLocation } from 'react-router-dom';

const AQI = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userLocation = queryParams.get('location');

  return (
    <Box sx={{ padding: 4 }}>
      {/* User Location Display */}
      <Typography variant="h5" textAlign="center" sx={{ fontWeight: 'medium', my: 3 }}>
        Location: {userLocation}
      </Typography>

      {/* AQI Chart */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
        Air Quality Index (AQI)
      </Typography>
      <AQIChart />

      {/* Air Quality Trends Chart */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mt: 5, mb: 3 }}>
        Air Quality Trends
      </Typography>
      <AirQualityTrendsChart /> {/* New line chart component */}
    </Box>
  );
};

export default AQI;
