import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const ContactDialog = ({ open, onClose }) => {
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContactFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!contactEmail || !contactMessage) {
      alert('Email and message cannot be empty');
      return;
    }
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/contact', {
        email: contactEmail,
        message: contactMessage,
      });
      setSnackbarMessage('Message sent successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSnackbarMessage('Error sending message. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      onClose();
      setContactEmail('');
      setContactMessage('');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Contact Us</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you have any questions or feedback, please fill out the form below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleContactFormSubmit} disabled={loading}>
            {loading ? 'Sending...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('Error') ? 'error' : 'success'} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactDialog;