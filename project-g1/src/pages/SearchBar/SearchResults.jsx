import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';

const SearchResults = ({ searchTerm }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const database = getDatabase();
        const gamesRef = ref(database, 'games');

        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const gamesArray = Object.entries(data).map(([gameId, gameData]) => ({
            id: gameId,
            ...gameData,
          }));
          setGames(gamesArray);
        } else {
          console.log('Nenhum jogo encontrado.');
        }
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchGamesData();
  }, [searchTerm]);

  const filteredGames = games.filter((game) =>
    searchTerm ? game.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div>
      <h1>Lista de Jogos:</h1>
      {filteredGames.length > 0 ? (
        <ul>
          {filteredGames.map((game) => (
            <li key={game.id}>
              <Link to={`/game/${game.id}`}>
                <h3>{game.title}</h3>
                <img src={game.image} alt={game.title} style={{ maxWidth: '100%' }} />
                <p>{game.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum jogo encontrado.</p>
      )}
    </div>
  );
};

export default SearchResults;
