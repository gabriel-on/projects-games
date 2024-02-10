import React from 'react';
import { Link } from 'react-router-dom';

const AdvancedSearchResults = ({ results }) => {
  return (
    <div>
      <h2>Resultados da Pesquisa</h2>
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
