// GameContainer.jsx
import React, { useState, useEffect } from 'react';
import GameHighlights from '../GameHighlights/GameHighlights';
import FeaturedGame from '../FeaturedGame/FeaturedGame';

const GameContainer = () => {
  const [latestGame, setLatestGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestGame = async () => {
      try {
        // Lógica para buscar o jogo mais recente (mesmo código que você já tem)
      } catch (error) {
        console.error('Erro ao buscar o jogo mais recente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestGame();
  }, []);

  return (
    <div>
      <GameHighlights latestGame={latestGame} loading={loading} />
      <FeaturedGame latestGame={latestGame} loading={loading} />
    </div>
  );
};

export default GameContainer;
