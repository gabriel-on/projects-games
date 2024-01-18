import React, { createContext, useContext, useState } from 'react';

const ProgressBarContext = createContext();

export const ProgressBarProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const setProgressBar = (value) => {
    setProgress(value);
  };

  const hideProgressBar = () => {
    console.log("Hiding progress bar");
    setIsVisible(false);
  };

  return (
    <ProgressBarContext.Provider value={{ progress, setProgressBar, isVisible, hideProgressBar }}>
      {children}
    </ProgressBarContext.Provider>
  );
};

export const useProgressBar = () => {
  const context = useContext(ProgressBarContext);

  if (!context) {
    throw new Error('useProgressBar must be used within a ProgressBarProvider');
  }

  return context;
};
