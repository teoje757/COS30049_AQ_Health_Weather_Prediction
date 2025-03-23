import React, { useState, useContext } from 'react';

import { UserContext } from '../NavBar/UserContext';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
  Switch,
  Alert,
  Autocomplete,
  Box,
  LinearProgress,
  Snackbar,
  Tooltip,
} from '@mui/material';

import axios from 'axios';

const conditionsList = [
  'Asthma',
  'Cancer',
  'CardiacDisease',
  'Diabetes',
  'Hypertension',
  'Epilepsy',
  'Other',
];

const medicationsList = [
  { title: 'Albuterol' },
  { title: 'Montelukast' },
  { title: 'Fluticasone' },
  { title: 'Cetirizine' },
  { title: 'Levocetirizine' },
  { title: 'Loratadine' },
  { title: 'Budesonide' },
  { title: 'Diphenhydramine' },
  { title: 'Prednisone' },
  { title: 'Benadryl' },
];

const symptomsList = [
  'Chest pain',
  'Lymphatic',
  'Hematological',
  'Musculoskeletal',
  'Neurological',
  'Respiratory',
  'Gastrointestinal',
  'Weight gain',
  'Cardiovascular',
  'Psychiatric',
  'Weight loss',
  'Other',
];

const HealthReportDialog = ({ open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('Male');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [conditions, setConditions] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [takingMedication, setTakingMedication] = useState('no');
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'
  const { setUser } = useContext(UserContext); // Access setUser from UserContext

  // Reset function to clear all fields
  const resetFields = () => {
      setFirstName('');
      setLastName('');
      setAge('');
      setWeight('');
      setHeight('');
      setGender('');
      setContactNumber('');
      setEmail('');
      setConditions('');
      setSymptoms('');
      setMedications('');
      setSmokingStatus('');
  };
  // Error states
  const [contactError, setContactError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [weightError, setWeightError] = useState(false);
  const [heightError, setHeightError] = useState(false);
  const [smokingStatus, setSmokingStatus] = useState('non-smoker'); // Example default value

  const validatePhoneNumber = (number) => {
    // General phone validation (10-15 digits with optional + at start for international format)
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(number);
  };

  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    // Format the phone number to +000-00000000
    const formattedValue = value
    .replace(/\D/g, '') // Remove all non-digit characters
    .replace(/^(\d{0,3})(\d{0,7})/, '$1-$2'); // Insert hyphen after the area code

    // Add + in front of the area code if it has 3 digits
    if (formattedValue.length > 0 && formattedValue.charAt(0) !== '+') {
      setContactNumber(`+${formattedValue}`);
    } else {
      setContactNumber(formattedValue);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!validateEmail(value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Resetting errors
    setContactError(false);
    setEmailError(false);
    setNameError(false);
    setAgeError(false);
    setWeightError(false);
    setHeightError(false);

    let isValid = true;

    if (!/^\+\d{3}-\d{8}$/.test(contactNumber)) {
      setContactError(true);
      isValid = false;
    }
    
    if (!firstName || !lastName) {
      setNameError(true);
      isValid = false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    }
    if (age < 0 || age > 110) {
      setAgeError(true);
      isValid = false;
    }
    if (weight <= 0) {
      setWeightError(true);
      isValid = false;
    }
    if (height <= 0) {
      setHeightError(true);
      isValid = false;
    }

    if (!isValid) {
      console.log("Validation failed");
      return; // Prevent submission if any validation fails
    }

    const formData = {
      firstName,
      lastName,
      age,
      weight,
      height,
      gender,
      contactNumber,
      email,
      conditions,
      symptoms,
      medications,
      smokingStatus,
    };

    console.log("Submitting form data:", formData); // Log the form data

    // Send the data to the back-end
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/healthReport', formData);

      // Set full user data in UserContext on successful submission
      setUser({
        ...formData, // Updates all fields in the context at once
      });
      
      setLoading(false);
      onClose(true); // Close the dialog

      // Display success message
      setSnackbarMessage("Health report submitted successfully!");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("There was an error submitting the health report!", error);
      setLoading(false);

      // Display error message
      setSnackbarMessage("Error submitting health report. Please try again.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleConditionChange = (condition) => {
    setConditions((prev) => {
      if (prev.includes(condition)) {
        return prev.filter((c) => c !== condition);
      }
      return [...prev, condition];
    });
  };

  const handleSymptomChange = (symptom) => {
    setSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom);
      }
      return [...prev, symptom];
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Let's Get to Know Your Body Health</DialogTitle>
      <DialogContent>
        {/* Name Fields */}
        <Typography gutterBottom>Full Name</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              required
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
              error={nameError}
              helperText={nameError ? 'Please enter your first and last name.' : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
              error={nameError}
              helperText={nameError ? 'Please enter your first and last name.' : ''}
            />
          </Grid>
        </Grid>

        {/* Age Slider */}
        <Box my={2}>
          <Typography gutterBottom>What is your age?</Typography>
          <Slider
            value={age}
            onChange={(e, value) => setAge(value)}
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
          {ageError && <Typography color="error">Please enter a valid age (0-100).</Typography>}
        </Box>

        {/* Contact Information with Real-time Validation */}
        <Box my={2}>
          <Tooltip title="Enter a valid phone number Enter a valid phone number (e.g., +000-00000000)">
            <TextField
              required
              label="Contact Number"
              value={contactNumber}
              onChange={handleContactNumberChange}
              fullWidth
              margin="normal"
              error={contactError}
              helperText={contactError ? 'Please enter a valid phone number (e.g., +000-00000000).' : ''}
            />
          </Tooltip>

          <Tooltip title="Enter a valid email address.">
            <TextField
              required
              label="Email"
              value={email}
              onChange={handleEmailChange}
              fullWidth
              margin="normal"
              error={emailError}
              helperText={emailError ? 'Please enter a valid email address.' : ''}
            />
          </Tooltip>
        </Box>

        {/* Gender Selection */}
        <Box my={2}>
          <Typography variant="subtitle1">What is your gender?</Typography>
          <RadioGroup value={gender} onChange={(e) => setGender(e.target.value)} row>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Box>

        {/* Weight and Height */}
        <Box my={3}>
          <TextField
            margin="dense"
            label="Weight (kg)"
            type="number"
            fullWidth
            variant="outlined"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setWeightError(e.target.value <= 0); // Validate weight
            }}
            error={weightError}
            helperText={weightError ? 'Please enter a valid weight.' : ''}
          />

          <TextField
            margin="dense"
            label="Height (cm)"
            type="number"
            fullWidth
            variant="outlined"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              setHeightError(e.target.value <= 0); // Validate height
            }}
            error={heightError}
            helperText={heightError ? 'Please enter a valid height.' : ''}
          />
        </Box>

        

        {/* Medical Conditions */}
        <Typography variant="subtitle1">Do you have any medical conditions?</Typography>
        <Typography variant="caption" color="textSecondary" gutterBottom>
          (You can choose more than one)
        </Typography>
        <Grid container spacing={0}>
          {conditionsList.map((condition) => (
            <Grid item xs={6} key={condition}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={conditions.includes(condition)}
                    onChange={() => handleConditionChange(condition)}
                  />
                }
                label={condition}
              />
            </Grid>
          ))}
        </Grid>

        {/* Symptoms */}
        <Box my={3}>
          <Typography variant="subtitle1">Do you have any symptoms?</Typography>
          <Typography variant="caption" color="textSecondary" gutterBottom>
            (You can choose more than one)
          </Typography>
          <Grid container spacing={0}>
            {symptomsList.map((symptom) => (
              <Grid item xs={6} key={symptom}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                    />
                  }
                  label={symptom}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Smoking status */}
        <Typography variant="subtitle1">What is your smoking status?</Typography>
        <RadioGroup value={smokingStatus} onChange={(e) => setSmokingStatus(e.target.value)} row>
          <FormControlLabel value="non-smoker" control={<Radio />} label="Non-smoker" />
          <FormControlLabel value="smoker" control={<Radio />} label="Smoker" />
          <FormControlLabel value="former-smoker" control={<Radio />} label="Former Smoker" />
        </RadioGroup>


        {/* Medications */}
        <Box mt={3}>
          <Typography variant="subtitle1">Are you currently taking any medication?</Typography>
          <RadioGroup value={takingMedication} onChange={(e) => setTakingMedication(e.target.value)} row>
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Box>
        

        {takingMedication === 'yes' && (
          <Autocomplete
            multiple
            options={medicationsList}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => setMedications(newValue)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Select medications" />
            )}
          />
        )}

        {loading && <LinearProgress />}

        {/* Snackbar for submission feedback */}
        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message={loading ? "Submitting..." : "Health report submitted successfully!"} // Adjust this message based on success or failure
          autoHideDuration={6000}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={resetFields} color="error">Reset</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}> Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HealthReportDialog;