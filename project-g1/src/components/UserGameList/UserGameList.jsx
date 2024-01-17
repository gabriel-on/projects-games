import React, { useState, useEffect } from 'react';
import GameStatus from '../GamesStatus/GamesStatus';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const UserGameList = ({ userId }) => {
  const [markedGames, setMarkedGames] = useState([]);
  const [gameDetails, setGameDetails] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMarkedGames = async () => {
      try {
        const database = getDatabase();
        const userMarksRef = ref(database, `userMarks/${userId}`);
        const userMarksSnapshot = await get(userMarksRef);

        if (userMarksSnapshot.exists()) {
          const markedGamesArray = Object.keys(userMarksSnapshot.val());
          setMarkedGames(markedGamesArray);

          // Buscar detalhes dos jogos marcados
          const gamesDetailsPromises = markedGamesArray.map(async (gameId) => {
            const gameRef = ref(database, `games/${gameId}`);
            const gameSnapshot = await get(gameRef);

            if (gameSnapshot.exists()) {
              const gameData = gameSnapshot.val();
              return { id: gameId, name: gameData.title };
            }

            return null;
          });

          const gamesDetails = await Promise.all(gamesDetailsPromises);
          const filteredGamesDetails = gamesDetails.filter(Boolean);
          const gamesDetailsMap = Object.fromEntries(filteredGamesDetails.map(({ id, name }) => [id, name]));
          setGameDetails(gamesDetailsMap);
        } else {
          setMarkedGames([]);
          setGameDetails({});
        }
      } catch (error) {
        console.error('Erro ao obter jogos marcados:', error);
      }
    };

    const auth = getAuth();
    if (auth.currentUser) {
      setUser(auth.currentUser);
      fetchMarkedGames();
    }
  }, [userId]);

  const handleMarkGame = async (gameId) => {
    try {
      const database = getDatabase();
      const userMarksRef = ref(database, `userMarks/${userId}/${gameId}`);
      await set(userMarksRef, true);

      // Atualizar a lista de jogos marcados
      setMarkedGames((prevMarkedGames) => [...prevMarkedGames, gameId]);
    } catch (error) {
      console.error('Erro ao marcar jogo:', error);
    }
  };

  const handleUnmarkGame = async (gameId) => {
    try {
      const database = getDatabase();
      const userMarksRef = ref(database, `userMarks/${userId}/${gameId}`);
      await remove(userMarksRef);

      // Atualizar a lista de jogos marcados
      setMarkedGames((prevMarkedGames) => prevMarkedGames.filter((id) => id !== gameId));
    } catch (error) {
      console.error('Erro ao desmarcar jogo:', error);
    }
  };

  return (
    <div>
      {markedGames.length > 0 ? (
        <ul>
          {markedGames.map((gameId) => (
            <li key={gameId}>
              <GameStatus
                gameId={gameId}
                onUnmarkGame={handleUnmarkGame}
                onMarkGame={handleMarkGame}
                isMarked={markedGames.includes(gameId)}
              />
              <p>Nome do Jogo: {gameDetails[gameId]}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum jogo marcado.</p>
      )}
    </div>
  );
};

export default UserGameList;