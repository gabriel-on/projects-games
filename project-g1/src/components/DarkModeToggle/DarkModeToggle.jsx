import React from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = ({ toggleDarkMode }) => {
  return (
    <div className='dark-mode-toggle'>
      <label>
        <input type='checkbox' onChange={toggleDarkMode} />
        Modo Escuro
      </label>
    </div>
  );
};

export default DarkModeToggle;
