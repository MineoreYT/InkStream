import React, { createContext, useContext, useState, useEffect } from 'react';

const NSFWContext = createContext();

export const useNSFW = () => {
  const context = useContext(NSFWContext);
  if (!context) {
    throw new Error('useNSFW must be used within an NSFWProvider');
  }
  return context;
};

export const NSFWProvider = ({ children }) => {
  const [includeNSFW, setIncludeNSFW] = useState(false);
  const [showNSFWWarning, setShowNSFWWarning] = useState(true);

  // Load NSFW preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('inkstream-nsfw-enabled');
    const savedWarning = localStorage.getItem('inkstream-nsfw-warning');
    
    if (savedPreference !== null) {
      setIncludeNSFW(JSON.parse(savedPreference));
    }
    
    if (savedWarning !== null) {
      setShowNSFWWarning(JSON.parse(savedWarning));
    }
  }, []);

  const toggleNSFW = () => {
    const newValue = !includeNSFW;
    setIncludeNSFW(newValue);
    localStorage.setItem('inkstream-nsfw-enabled', JSON.stringify(newValue));
  };

  const dismissWarning = () => {
    setShowNSFWWarning(false);
    localStorage.setItem('inkstream-nsfw-warning', JSON.stringify(false));
  };

  const value = {
    includeNSFW,
    showNSFWWarning,
    toggleNSFW,
    dismissWarning,
  };

  return (
    <NSFWContext.Provider value={value}>
      {children}
    </NSFWContext.Provider>
  );
};