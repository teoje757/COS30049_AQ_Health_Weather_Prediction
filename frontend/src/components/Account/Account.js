import React, { useContext, useEffect, useState } from 'react';
import { Typography, Box, Grid, Paper, Avatar, Button } from '@mui/material';
import { UserContext } from '../NavBar/UserContext';
import HealthReportDialog from '../Index/healthReportDialog';

const Account = () => {
  const { user } = useContext(UserContext);

  const [healthData, setHealthData] = useState({
    age: { value: user.age, title: 'Age', emoji: '🎂' },
    gender: { value: user.gender, title: 'Gender', emoji: '♀️' },
    healthCondition: { value: user.conditions.join(', ') || 'None', title: 'Health Condition', emoji: '✅' },
    bloodPressure: { value: '120/80', title: 'Blood Pressure', emoji: '🩺' },
    heartRate: { value: '72 bpm', title: 'Heart Rate', emoji: '❤️' },
    bedtime: { value: '10:30 pm', title: 'Bedtime', emoji: '🌙' },
    glucoseLevel: { value: '90 mg/dL', title: 'Glucose Level', emoji: '🍭' },
    bloodStatus: { value: 'Normal', title: 'Blood Status', emoji: '🩸' },
    activityLevel: { value: 'Active', title: 'Activity Level', emoji: '🏃‍♀️' },
  });

  const [healthReportDialogOpen, setHealthReportDialogOpen] = useState(false);
  const [dataSubmitted, setDataSubmitted] = useState(false); // Track if data has been submitted

  useEffect(() => {
    // Function to update health data based on user information
    const updateHealthData = () => {
      let updatedHealthData = {
        age: { value: user.age, title: 'Age', emoji: '🎂' },
        gender: { value: user.gender, title: 'Gender', emoji: '♀️' },
        healthCondition: { value: user.conditions.join(', ') || 'None', title: 'Health Condition', emoji: '✅' },
        bloodPressure: { value: '120/80', title: 'Blood Pressure', emoji: '🩺' },
        heartRate: { value: '72 bpm', title: 'Heart Rate', emoji: '❤️' },
        bedtime: { value: '10:30 pm', title: 'Bedtime', emoji: '🌙' },
        glucoseLevel: { value: '90 mg/dL', title: 'Glucose Level', emoji: '🍭' },
        bloodStatus: { value: 'Normal', title: 'Blood Status', emoji: '🩸' },
        activityLevel: { value: 'Active', title: 'Activity Level', emoji: '🏃‍♀️' },
      };

      // Update health data based on age
      if (user.age > 50) {
        updatedHealthData.bloodPressure.value = '130/85';
        updatedHealthData.heartRate.value = '75 bpm';
      }
      if (user.age > 60) {
        updatedHealthData.bedtime.value = '10:00 pm';
      }

      // Adjustments based on conditions
      if (user.conditions.includes('Hypertension')) {
        updatedHealthData.bloodPressure.value = '135/90';
        updatedHealthData.heartRate.value = '78 bpm';
        updatedHealthData.bloodStatus.value = 'At Risk';
      }
      if (user.conditions.includes('Cardiac disease')) {
        updatedHealthData.bloodPressure.value = '140/90';
        updatedHealthData.heartRate.value = '80 bpm';
        updatedHealthData.bloodStatus.value = 'At Risk';
      }
      if (user.conditions.includes('Diabetes')) {
        updatedHealthData.glucoseLevel.value = '150 mg/dL'; // Example value for diabetes
        updatedHealthData.bloodStatus.value = 'At Risk';
      }
      if (user.conditions.includes('Obesity')) {
        updatedHealthData.bloodPressure.value = '135/85';
        updatedHealthData.activityLevel.value = 'Sedentary';
      }
      if (user.conditions.includes('Asthma')) {
        updatedHealthData.bloodStatus.value = 'Requires monitoring';
      }

      // Adjustments based on smoking status
      if (user.smokingStatus === 'smoker') {
        updatedHealthData.bloodPressure.value = '130/85';
        updatedHealthData.heartRate.value = `${parseInt(updatedHealthData.heartRate.value) + 5} bpm`;
        updatedHealthData.bloodStatus.value = 'At Risk';
      }

      // Gender-based adjustments
      if (user.gender === 'Female') {
        if (user.age < 50) {
          updatedHealthData.heartRate.value = '70 bpm'; // Typically lower heart rate for younger females
        }
      } else if (user.gender === 'Male') {
        if (user.age < 50) {
          updatedHealthData.heartRate.value = '72 bpm'; // Typical for younger males
        }
      }

      setHealthData(updatedHealthData);
    };

    // Update health data whenever user changes
    updateHealthData();
  }, [user]);

  const handleHealthReportDialogOpen = () => {
    setHealthReportDialogOpen(true);
  };

  const handleHealthReportDialogClose = (dataSubmitted) => {
    setHealthReportDialogOpen(false);
    if (dataSubmitted) {
      setDataSubmitted(true); // Update the state to indicate data has been submitted
    }
  };

  return (
    <Box sx={{ margin: 5, padding: 2, bgcolor: 'background.default', flex: 1, minHeight: '100vh' }}>
      <Typography variant="h4" marginLeft={6} gutterBottom sx={{ marginBottom: 2 }}>
        Hi, {user?.firstName}! 🥰
      </Typography>
      <Typography variant="h6" marginLeft={6} gutterBottom sx={{ marginBottom: 4 }}>
        Check your health!
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleHealthReportDialogOpen}
        sx={{ marginBottom: 3, marginLeft: 6 }}
      >
        {dataSubmitted ? 'Update Health Report' : 'Check Now'} {/* Change button text based on data submitted */}
      </Button>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        {Object.entries(healthData).map(([key, data]) => (
          <Grid item xs={3} key={key}>
            <Paper 
              elevation={3} 
              sx={{ 
                paddingRight: 2, 
                borderRadius: 3, 
                bgcolor: 'lightgrey', 
                display: 'flex', 
                alignItems: 'center', 
                height: '130px', 
                marginBottom: 2,
                marginX: 5
              }}
            >
              <Avatar sx={{ marginX: 2, bgcolor: 'transparent' }}>
                {data.emoji}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '0.8rem', color: 'grey' }}>
                  {data.title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {data.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Health Report Dialog */}
      <HealthReportDialog open={healthReportDialogOpen} onClose={handleHealthReportDialogClose} />
    </Box>
  );
};

export default Account;