// components/SearchLocation.js
import React, { useState } from 'react';

import { Box, TextField, IconButton, Autocomplete, InputAdornment } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import { useNavigate } from 'react-router-dom';

const sampleLocations = [
  "London Bridge",
  "Piccadilly Circus",
  "Westminster",
  "Camden Town",
  "Shoreditch",
  "Notting Hill",
  "Greenwich",
  "Soho",
  "Covent Garden",
  "Brixton"
]; // Sample data for location suggestions

const SearchLocation = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  // Handle search action when user presses Enter
  const handleSearch = (event) => {
    if (event.key === 'Enter' && inputValue) {
      window.location.href = `/aqi?location=${encodeURIComponent(inputValue)}`;
      setSearchOpen(false); // Close search box
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Search Icon Button */}
      {!searchOpen && (
        <IconButton onClick={() => setSearchOpen(true)}>
          <SearchIcon />
        </IconButton>
      )}

      {/* Expandable Search Input */}
      {searchOpen && (
        <Autocomplete
          freeSolo
          options={sampleLocations}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          onClose={() => setSearchOpen(false)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search for a location in London"
              variant="outlined"
              size="small"
              onKeyDown={handleSearch} // Trigger search on Enter
              autoFocus
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchOpen(false)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ width: 200 }}
            />
          )}
        />
      )}
    </Box>
  );
};

export default SearchLocation;