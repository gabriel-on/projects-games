// FeaturedGame.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import './FeaturedGame.css';
import GameBackground from './GameBackground.jsx';
import GameDisplay from './GameDisplay';

const FeaturedGame = ({ gameId, isActive, onToggle, onNext, onPrev, activeIndex, gameIds }) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameCounter, setGameCounter] = useState(0);

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

        setLoading(false);
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, gameCounter]); 

  useEffect(() => {
    // Muda o jogo quando o índice ativo muda
    setGameCounter(activeIndex);
  }, [activeIndex]);

  const handleNext = async () => {
    if (!loading) {
      setLoading(true);

      // Chame a função onNext que muda o jogo e espere até que a mudança seja concluída
      await onNext(gameCounter);

      // Atualize o contador de jogo
      setGameCounter((prevCounter) => (prevCounter + 1) % gameIds.length);

      setLoading(false);
    }
  };

  const handlePrev = async () => {
    if (!loading) {
      setLoading(true);

      // Chame a função onPrev que muda o jogo e espere até que a mudança seja concluída
      await onPrev(gameCounter);

      // Atualize o contador de jogo
      setGameCounter((prevCounter) => (prevCounter - 1 + gameIds.length) % gameIds.length);

      setLoading(false);
    }
  };

  return (
    <div className={`featured-game ${isActive ? 'active' : ''}`}>
      <div className='container-games'>
        <div className="navigation-buttons">
          <button className='btn-pn' onClick={handlePrev}>&lt;</button>
        </div>
        <GameDisplay gameId={gameId} gameData={gameData} />
        <div className="navigation-buttons">
          <button className='btn-pn' onClick={handleNext}>&gt;</button>
        </div>
      </div>
      {/* GameBackground fica no fundo */}
      <GameBackground backgroundImage={gameData ? gameData.image : null} />
    </div>
  );
};

export default FeaturedGame;