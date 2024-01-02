import React, { useState, useEffect } from 'react';
import { getDatabase, ref, orderByChild, limitToLast, get } from 'firebase/database';
import GameList from '../GameList/GameList';
import GameDisplay from '../FeaturedGame/GameDisplay';

const GameHighlights = () => {
  const [latestGame, setLatestGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestGame = async () => {
      try {
        const database = getDatabase();
        const gamesRef = ref(database, 'games');
        const gamesQuery = limitToLast(orderByChild(gamesRef, 'releaseDate'), 1);

        const gamesSnapshot = await get(gamesQuery);

        if (gamesSnapshot.exists()) {
          const latestGameData = gamesSnapshot.val();
          console.log('Games Snapshot:', gamesSnapshot);
          console.log('Latest Game Data:', latestGameData);
          setLatestGame(latestGameData);
        } else {
          console.log('Nenhum jogo encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar o jogo mais recente (GameHighlights):', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestGame();
  }, []);

  return (
    <div>
      <h2>Jogo Mais Recente</h2>
      <GameDisplay/>
    </div>
  );
};

export default GameHighlights;
