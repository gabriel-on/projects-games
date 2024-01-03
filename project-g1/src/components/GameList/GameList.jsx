import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { Link } from 'react-router-dom';

const GameList = ({ searchTerm }) => {
  const [games, setGames] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedGames, setSelectedGames] = useState([]);

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

    if (selectAll) {
      // Se estiver selecionado, desmarcar todos os jogos
      setSelectedGames([]);
    } else {
      // Se não estiver selecionado, selecionar todos os jogos
      setSelectedGames(games.map((game) => game.id));
    }
  };

  const handleToggleSelectGame = (gameId) => {
    setSelectedGames((prevSelectedGames) => {
      if (prevSelectedGames.includes(gameId)) {
        return prevSelectedGames.filter((id) => id !== gameId);
      } else {
        return [...prevSelectedGames, gameId];
      }
    });

    // Verificar se todos os jogos estão selecionados para atualizar o estado de 'selectAll'
    const allGamesSelected = games.every((game) => selectedGames.includes(game.id));
    setSelectAll(allGamesSelected);
  };

  const handleDelete = async (gameId) => {
    try {
      const shouldDelete = window.confirm("Tem certeza que deseja excluir este jogo?");

      if (!shouldDelete) {
        return;
      }

      const database = getDatabase();
      const gameRef = ref(database, `games/${gameId}`);

      await remove(gameRef);

      // Atualizar a lista de jogos após a exclusão
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));

      // Desmarcar o jogo excluído da seleção
      setSelectedGames((prevSelectedGames) => prevSelectedGames.filter((id) => id !== gameId));

      // Verificar se todos os jogos estão selecionados para atualizar o estado de 'selectAll'
      const allGamesSelected = games.every((game) => selectedGames.includes(game.id));
      setSelectAll(allGamesSelected);
    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const shouldDelete = window.confirm("Tem certeza que deseja excluir os jogos selecionados?");

      if (!shouldDelete) {
        return;
      }

      const database = getDatabase();
      const gamesToDelete = selectedGames.map((gameId) => ref(database, `games/${gameId}`));

      // Excluir todos os jogos selecionados em sequência
      for (const gameRef of gamesToDelete) {
        await remove(gameRef);
      }

      // Atualizar a lista de jogos após a exclusão
      setGames((prevGames) => prevGames.filter((game) => !selectedGames.includes(game.id)));

      // Limpar a lista de jogos selecionados
      setSelectedGames([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Erro ao excluir jogos selecionados:', error);
    }
  };

  if (games.length === 0) {
    return <p>Nenhum jogo disponível.</p>;
  }

  // Filtrar os jogos com base no termo de pesquisa
  const filteredGames = games.filter((game) =>
    searchTerm ? game.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  if (filteredGames.length === 0) {
    return <p>Nenhum jogo disponível.</p>;
  }

  return (
    <div>
      <div>
        <button onClick={handleToggleSelectAll}>
          {selectAll ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
        {selectedGames.length > 0 && (
          <button onClick={handleDeleteSelected}>Excluir Selecionados</button>
        )}
        <ul>
          {filteredGames.map((game) => (
            <li key={game.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectAll || selectedGames.includes(game.id)}
                  onChange={() => handleToggleSelectGame(game.id)}
                />
                <div to={`/game/${game.id}`}>
                  <h3>{game.title}</h3>
                  <img src={game.image} alt={game.title} style={{ maxWidth: '100%' }} />
                  <p>{game.description}</p>
                </div>
              </label>
              <Link to={`/edit/${game.id}`}>
                <button>Editar</button>
              </Link>
              <button onClick={() => handleDelete(game.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameList;
