import React from 'react';
import GameDisplay from './GameDisplay';

const GameList = ({ games, limit }) => (
  <div className='game-list'>
    {Array.isArray(games) ? games.slice(0, limit).map((game) => (
      <GameDisplay key={game.id} gameId={game.id} gameData={game.data} />
    )) : null}
  </div>
);

export default GameList;