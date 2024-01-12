import React, { useState, useEffect } from 'react';
import GameStatus from '../GamesStatus/GamesStatus';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const UserGameList = () => {
  const [markedGames, setMarkedGames] = useState([]);
  const [gameDetails, setGameDetails] = useState({});
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchMarkedGames = async () => {
      try {
        const database = getDatabase();
        const userMarksRef = ref(database, `userMarks/${user.uid}`);
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

    if (user) {
      fetchMarkedGames();
    }
  }, [user]);

  return (
    <div>
      <h2>Sua lista de Jogos Marcados:</h2>
      {markedGames.length > 0 ? (
        <ul>
          {markedGames.map((gameId) => (
            <li key={gameId}>
              <GameStatus gameId={gameId} />
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
