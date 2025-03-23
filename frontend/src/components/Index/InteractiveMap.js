// InteractiveMap.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, Typography, Button } from '@mui/material';
  
const InteractiveMap = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  
  // Example locations with AQI and weather info
  const locations = [
    { position: [51.505, -0.09], name: 'London', aqi: 40, weather: 'Sunny' },
    { position: [48.8566, 2.3522], name: 'Paris', aqi: 30, weather: 'Cloudy' },
    { position: [40.7128, -74.0060], name: 'New York', aqi: 50, weather: 'Rainy' },
  ];

  const handleAreaClick = (location) => {
    setSelectedArea(location);
  };

  return (
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, index) => (
          <Marker 
            key={index} 
            position={location.position} 
            eventHandlers={{ click: () => handleAreaClick(location) }}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedArea && (
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5">{selectedArea.name}</Typography>
            <Typography variant="body1">AQI: {selectedArea.aqi}</Typography>
            <Typography variant="body1">Weather: {selectedArea.weather}</Typography>
            <Button
              variant="contained"
              color="primary"
              href="https://aqicn.org"
              target="_blank"
              style={{ marginTop: '10px' }}
            >
              View AQI Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
