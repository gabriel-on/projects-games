import React from 'react';
import useGameInteractions from '../../hooks/useGameInteractions';
import { Link } from 'react-router-dom';

const PopularGamesList = ({ gamesPerPage, currentPage }) => {
  const { gamesWithInteractions, isLoading } = useGameInteractions();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const limitedGamesArray = gamesWithInteractions.slice(startIndex, endIndex);

  return (
    <div className='all-games-list-container'>
      <ul className='all-games-list'>
        {limitedGamesArray.map((game) => (
          <li key={game.gameId}>
            <Link to={`/game/${game.gameId}`}>
              <img src={game.gameData.image} alt={game.gameData.title} title={game.gameData.title}/>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularGamesList;
