import React, { createContext, useContext, useState, useEffect } from 'react';

// Export the context
export const DarkModeContext = createContext();

// Export the Provider that wraps the entire app
export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('my-theme') === 'dark';
  });

  // This useEffect is executed every time darkMode changes
  useEffect(() => {
    const root = document.documentElement;

    // If darkMode is True, the class 'my-app-dark' will be added to the <html> and 'dark' will be saved in the localstorage
    if (darkMode) {
      root.classList.add('my-app-dark');
      localStorage.setItem('my-theme', 'dark');
    } else {
    // If darkMode is False, the 'my-app-dark' class is removed from the <html> and 'light' is saved in localstorage.
      root.classList.remove('my-app-dark');
      localStorage.setItem('my-theme', 'light');
    }
  }, [darkMode]);

  // Switch between dark and light mode.
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    // DarkModeContext.Provider is used to share state and functionality with the rest of the application
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>

      {/* {children} renders child components that are wrapped by the DarkModeProvider */}
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook to consume the context
export const useDarkMode = () => useContext(DarkModeContext);