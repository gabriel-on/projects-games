// FeaturedGame.js

import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const FeaturedGame = ({ gameId }) => {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const database = getDatabase();
        const gameRef = ref(database, `games/${gameId}`);

        const snapshot = await get(gameRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setGameData(data);
        } else {
          console.log(`Jogo com ID ${gameId} não encontrado.`);
        }
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchGameData();
  }, [gameId]);

  if (!gameData) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>{gameData.title}</h2>
      <img src={gameData.image} alt={gameData.title} style={{ maxWidth: '100%' }} />
      <p>{gameData.description}</p>
      {/* Adicione mais detalhes conforme necessário */}
    </div>
  );
};

export default FeaturedGame;
