import React from 'react';
import { Link } from 'react-router-dom';
import './AdvancedSearch.css'

const AdvancedSearchResults = ({ results }) => {
  return (
    <div className='Advanced-Search-Results-container'>
      <ul>
        {results && Array.isArray(results) && results.length > 0 ? (
          results.map((game) => (
            <li key={game.title}>
              <Link to={`/game/${game.id}`}>
                <img src={game.image} alt={game.title} />
                <p>{game.title}</p>
              </Link>
            </li>
          ))
        ) : (
          <li>Nenhum resultado encontrado</li>
        )}
      </ul>
    </div>
  );
};

export default AdvancedSearchResults;
