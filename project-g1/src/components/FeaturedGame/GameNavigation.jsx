// GameNavigation.jsx
import React from 'react';
import FeaturedGame from './FeaturedGame';

const GameNavigation = ({ onPrev, onNext }) => {
  return (
    <div className="navigation-buttons">
      <button className='btn-pn' onClick={onPrev}>&lt;</button>
      <button className='btn-pn' onClick={onNext}>&gt;</button>
    </div>
  );
};

export default GameNavigation;