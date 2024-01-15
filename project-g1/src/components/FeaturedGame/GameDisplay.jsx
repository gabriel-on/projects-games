// GameDisplay.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const GameDisplay = ({ gameId, gameData }) => (
  <Link to={`game/${gameId}`} className='game-display'>
    <h2>{gameData?.title}</h2>
    <img src={gameData?.image} alt={gameData?.title} />
  </Link>
);

export default GameDisplay;
