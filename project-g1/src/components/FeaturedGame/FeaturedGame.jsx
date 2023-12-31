// FeaturedGame.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import './FeaturedGame.css';
import { Link } from 'react-router-dom';

const FeaturedGame = ({ gameId, isActive, onToggle, onNext, onPrev }) => {
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

  return (
    <div className={`featured-game ${isActive ? 'active' : ''}`}>
      <Link to={`game/${gameId}`}>
        <h2>{gameData?.title}</h2>
        <img src={gameData?.image} alt={gameData?.title} style={{ maxWidth: '100%' }} />
        <p>{gameData?.description}</p>
        {/* Adicione mais detalhes conforme necessário */}
        <button onClick={() => onToggle(gameId)}>Detalhes</button>
      </Link>
      <div className="navigation-buttons">
        <button onClick={onPrev}>&lt; Anterior</button>
        <button onClick={onNext}>Próximo &gt;</button>
      </div>
    </div>
  );
};

export default FeaturedGame;