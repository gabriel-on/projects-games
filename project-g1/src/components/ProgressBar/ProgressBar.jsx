import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProgressBar.css';

const ProgressBar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const location = useLocation();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  
    if (scrollHeight > 0) {
      const scrolled = (window.scrollY / scrollHeight) * 100;
      console.log('Scrolled:', scrolled);
      setScrollPercentage(scrolled);
    } else {
      console.log('Scrolled: N/A (scrollHeight is zero or negative)');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollPercentage(0);
  }, [location.pathname]);

  return <div className="progress-bar" style={{ width: `${scrollPercentage}%` }} />;
};

export default ProgressBar;