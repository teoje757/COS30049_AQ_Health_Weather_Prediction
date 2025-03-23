import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Grid, Avatar } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { UserContext } from '../NavBar/UserContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const tipsByAqi = (aqi) => {
  if (aqi >= 0 && aqi <= 33) {
    return "Enjoy the fresh air! Outdoor activities are safe, and it's a great time for exercise or spending time outside.";
  } else if (aqi >= 34 && aqi <= 66) {
    return "Air quality is good! You can participate in outdoor activities without concern. Enjoy a walk, jog, or other recreational activities.";
  } else if (aqi >= 67 && aqi <= 99) {
    return "Air quality is fair. Sensitive individuals, such as those with respiratory issues, should consider limiting prolonged outdoor exertion. Others can still enjoy outdoor activities with some caution.";
  } else if (aqi >= 100 && aqi <= 149) {
    return "Air quality is poor, particularly for sensitive groups. It’s advisable to reduce outdoor activities and limit time spent outside, especially if you experience any health issues.";
  } else if (aqi >= 150 && aqi <= 200) {
    return "Air quality is unhealthy. Everyone may start to experience health effects. Limit outdoor activities, especially strenuous ones, and consider staying indoors.";
  } else if (aqi >= 201 && aqi <= 300) {
    return "Air quality is very unhealthy. It’s best to avoid outdoor activities altogether. Keep windows closed and use air purifiers if available.";
  } else {
    return "Air quality is hazardous. Everyone may experience serious health effects. Stay indoors, keep your indoor air clean, and avoid physical activity.";
  }
};

const conditionTips = {
  Asthma: "Ensure you have your rescue inhaler accessible and avoid outdoor activities during high pollution times. 💨",
  CardiacDisease: "Stay indoors during high pollution periods and follow your doctor's advice. ❤️",
  Diabetes: "Monitor your blood sugar levels closely, especially during poor air quality days. 🩸",
  Hypertension: "Limit outdoor activities on days with poor air quality and manage stress. 🧘",
  Cancer: "Avoid outdoor exposure during high pollution days. Maintain a balanced diet and rest well to support your recovery. 🌱",
  Epilepsy: "Keep a calm environment, and avoid intense physical activity during poor air quality days. Follow your treatment plan closely. 🧘",
  Other: "Stay mindful of air quality levels. Listen to your body, and avoid overexertion or exposure to pollutants when possible. 🌤️"
};

const HealthTipsComponent = () => {
  const { user } = useContext(UserContext);
  const [hourlyAQI, setHourlyAQI] = useState([]);
  const [weeklyTemperatures, setWeeklyTemperatures] = useState([]);
  const [loadingAQI, setLoadingAQI] = useState(true);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [errorAQI, setErrorAQI] = useState(null);
  const [errorWeekly, setErrorWeekly] = useState(null);
  const [customizedTips, setCustomizedTips] = useState([]);

  const fetchAQIPredictions = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict_hourly_aqi/', {
        hours_ahead: 24,
        mean_temp: 25.0,
        precipitation: 0.0,
        wspd: 5.0,
        wdir: 180.0,
        pressure: 1013.0,
        roadside_nitrogen_dioxide: 30.0,
        roadside_ozone: 40.0,
        roadside_pm10_particulate: 15.0,
        roadside_pm2_5_particulate: 10.0,
        background_nitrogen_dioxide: 20.0,
        background_ozone: 30.0,
        background_pm10_particulate: 15.0,
        background_pm2_5_particulate: 10.0
      });
      setHourlyAQI(response.data.hourly_aqi);
    } catch (error) {
      setErrorAQI('Failed to fetch AQI predictions');
    } finally {
      setLoadingAQI(false);
    }
  };

  const fetchWeeklyTemperatures = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict_weekly_temperature/', {
        days_ahead: 7,
      });
      setWeeklyTemperatures(response.data.weekly_temperatures);
    } catch (error) {
      setErrorWeekly('Failed to fetch weekly temperatures');
    } finally {
      setLoadingWeekly(false);
    }
  };

  useEffect(() => {
    fetchAQIPredictions();
    fetchWeeklyTemperatures();
  }, []);

  useEffect(() => {
    const generateCustomizedTips = () => {
      let tips = [];

      // Add AQI-specific tip
      const aqiTip = tipsByAqi(hourlyAQI[0]);
      tips.push(aqiTip);

      // Add condition-specific tips
      if (user.conditions && user.conditions.length > 0) {
        user.conditions.forEach(condition => {
          if (conditionTips[condition]) {
            tips.push(conditionTips[condition]);
          }
        });
      }
      setCustomizedTips(tips);
    };
    generateCustomizedTips();
  }, [hourlyAQI, user.conditions]);

  const getWeatherCondition = (temp) => {
    if (temp >= 7 && temp <= 18) return 'Rainy🌧️';
    if (temp > 18 && temp <= 21) return 'Cloudy☁️';
    if (temp > 25) return 'Sunny☀️';
    if (temp >= 16 && temp <= 25) return 'Partly Cloudy🌤️';
    return 'Unknown Weather';
  };

  const data = {
    labels: Array.from({ length: hourlyAQI.length }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Predicted AQI',
        data: hourlyAQI,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Today’s AQI Levels' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'AQI',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time of Day',
        },
      },
    },
  };

  const currentDate = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (loadingAQI || loadingWeekly) return <div>Loading...</div>;
  if (errorAQI) return <div>{errorAQI}</div>;
  if (errorWeekly) return <div>{errorWeekly}</div>;

  return (
    <Box padding={3}>
      <Typography variant="h6" color="#adadad" textAlign="center" sx={{ fontSize: 13, textTransform: 'uppercase', mb: 5 }}>
        User-Specific Recommendations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6, pl: 4 }}>
        <Grid item xs={12} md={6} px={6} sx={{ maxWidth: '90%' }}>
          <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '35px', mb: 1 }}>
            {customizedTips[0] || "Check the air quality before planning outdoor activities."}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} px={6} sx={{ maxWidth: '90%' }}>
          <Typography variant="h5" fontWeight="bold" color="#adadad" textAlign="center" sx={{ fontSize: 25, textTransform: 'uppercase', mb: 1 }}>
            Health Care Tips
          </Typography>
          {user.conditions && user.conditions.length > 0 ? (
            user.conditions.map((condition, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, lineHeight: 1.2, borderRadius: 3, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#ededed', fontSize: 24, mr: 1 }}>💊</Avatar>
                <Typography>{conditionTips[condition] || `Tip for ${condition}`}</Typography>
              </Card>
            ))
          ) : (
            <Typography>No health conditions provided.</Typography>
          )}
        </Grid>
      </Grid>

      {/* AQI Chart Section */}
      <Box sx={{ mb: 4, m: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ fontSize: 25 }}>
          Today's AQI Chart
        </Typography>
        <Bar data={data} options={options} />
      </Box>
      {/* Weekly Temperature Forecast Section */}
      <Typography variant="h5" fontWeight="bold" mb={2}>Weekly Temperature Forecast</Typography>
      <Grid container spacing={3}>
        {weeklyTemperatures.map((temp, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ border: `2px solid #00CD85`, borderRadius: 4, p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {daysOfWeek[(currentDate.getDay() + index) % 7]}
                </Typography>
                <Typography fontWeight="bold" variant="h4">
                  {temp}°C
                </Typography>
                {/* Display the weather condition under the temperature */}
                <Typography variant="body1" color="text.secondary">
                  {getWeatherCondition(temp)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HealthTipsComponent;