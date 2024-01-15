import React from 'react';
import PropTypes from 'prop-types';

import '../ThemeToggle/ThemeToggle.css';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
    </button>
  );
};

ThemeToggle.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ThemeToggle;
