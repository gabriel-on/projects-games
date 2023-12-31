// FeaturedGame.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import './FeaturedGame.css';
import GameBackground from './GameBackground.jsx';
import GameDisplay from './GameDisplay';

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
      <div className='container-games'>
        <div className="navigation-buttons">
          <button className='btn-pn' onClick={onPrev}>&lt;</button>
        </div>
        <GameBackground backgroundImage={gameData ? gameData.image : null} />
        <GameDisplay gameId={gameId} gameData={gameData} />
        <div className="navigation-buttons">
          <button className='btn-pn' onClick={onNext}>&gt;</button>
        </div>
      </div>
      {/* GameBackground fica no fundo */}
    </div>
  );
};

export default FeaturedGame;
