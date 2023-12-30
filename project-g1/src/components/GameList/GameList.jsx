import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { Link } from 'react-router-dom';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
  }, []);

  const handleToggleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    setSelectedGames([]);
  };

  const handleToggleSelectGame = (gameId) => {
    setSelectedGames((prevSelectedGames) => {
      if (prevSelectedGames.includes(gameId)) {
        return prevSelectedGames.filter((id) => id !== gameId);
      } else {
        return [...prevSelectedGames, gameId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    try {
      const database = getDatabase();
      const gamesRef = ref(database, 'games');

      // Excluir jogos selecionados
      await Promise.all(selectedGames.map(async (gameId) => {
        const gameRef = ref(gamesRef, gameId);
        await remove(gameRef);
      }));

      // Atualizar a lista de jogos após a exclusão
      const updatedGames = games.filter((game) => !selectedGames.includes(game.id));
      setGames(updatedGames);
      setSelectedGames([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Erro ao excluir jogos selecionados:', error);
    }
  };

  if (games.length === 0) {
    return <p>Nenhum jogo disponível.</p>;
  }

  return (
    <div>
      <h2>Lista de Jogos</h2>
      <button onClick={handleToggleSelectAll}>
        {selectAll ? 'Desmarcar Todos' : 'Selecionar Todos'}
      </button>
      {selectedGames.length > 0 && (
        <button onClick={handleDeleteSelected}>Excluir Selecionados</button>
      )}
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <label>
              <input
                type="checkbox"
                checked={selectAll || selectedGames.includes(game.id)}
                onChange={() => handleToggleSelectGame(game.id)}
              />
              <Link to={`/game/${game.id}`}>
                <h3>{game.title}</h3>
                <img src={game.image} alt={game.title} style={{ maxWidth: '100%' }} />
                <p>{game.description}</p>
              </Link>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
