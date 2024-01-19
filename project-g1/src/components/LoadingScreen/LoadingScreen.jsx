import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ loadingProgress }) => {
  return (
    <div className="LoadingScreen">
      <div className="LoadingScreen-bar">
        <div className="progress" style={{ width: `${loadingProgress}%` }}></div>
        <p className="loading-text">
          {`${loadingProgress}% Carregado...`}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
