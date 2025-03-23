import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

// Custom hook for easier access to UserContext
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: 'Guest',
    lastName: '',
    age: null,
    gender: '',
    conditions: [],
    medications: [],
    symptoms: [],
    smokingStatus: 'non-smoker',
    weight: 0,
    height: 0,
  });

  const updateUser = (newUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };