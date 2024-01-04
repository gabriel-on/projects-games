import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';
import useInteractions from '../../hooks/useInteractions';
import GameStatus from '../../components/GamesStatus/GamesStatus'

const SearchResults = ({ searchTerm }) => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    handleStatusChange,
    handleToggleFavorite,
    handleSaveChanges
  } = useInteractions()

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
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
        setIsLoading(false);
      }
    };

    fetchGamesData();
  }, [searchTerm]);

  const filteredGames = games.filter((game) =>
    searchTerm ? game.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div className='SearchResults'>
      {isLoading ? (
        <p>Carregando jogos...</p>
      ) : filteredGames.length > 0 ? (
        <ul>
          {filteredGames.map((game) => (
            <li key={game.id}>
              <Link to={`/game/${game.id}`}>
                <img src={game.image} alt={game.title} />
                <h3>{game.title}</h3>
              </Link>
              <div>
                <GameStatus
                  className="games-status"
                  gameId={game.id}
                  onStatusChange={handleStatusChange}
                  onToggleFavorite={handleToggleFavorite}
                  onSaveChanges={handleSaveChanges}
                />
              </div>
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
