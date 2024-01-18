import React from 'react';
import { useProgressBar } from '../../context/ProgressBarContext.jsx';
import './ProgressBar.css';

const ProgressBar = () => {
  const { progress } = useProgressBar();

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
