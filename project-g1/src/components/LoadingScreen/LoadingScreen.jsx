// LoadingScreen.jsx

import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ loadingProgress }) => {
  return (
    <div className="LoadingScreen-bar">
      <div className="progress" style={{ width: `${loadingProgress}%` }}></div>
      <div className="loading-text">{`${loadingProgress}% Carregado`}</div>
    </div>
  );
};

export default LoadingScreen;
