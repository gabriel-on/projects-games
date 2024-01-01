// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import FeaturedGame from '../../components/FeaturedGame/FeaturedGame.jsx';
import GameHighlights from '../../components/GameHighlights/GameHighlights.jsx';
import { getDatabase, ref, get } from 'firebase/database';

import '../../pages/Home/Home.css';
import GameContainer from '../../components/GameContainer/GameContainer.jsx';

const Home = () => {
  const [gameIds, setGameIds] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchGameIds = async () => {
      try {
        const database = getDatabase();
        const gamesRef = ref(database, 'games');
        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const ids = Object.keys(data).reverse(); // Inverte a ordem para mais recente para mais antigo
          setGameIds(ids);
        } else {
          console.log('Nenhum jogo encontrado.');
        }
      } catch (error) {
        console.error('Erro ao obter IDs de jogos do Firebase:', error);
      }
    };

    fetchGameIds();
  }, []);

  useEffect(() => {
    const gameIdsLimit = 3; // Define o limite desejado

    const intervalId = setInterval(() => {
      const nextIndex = (activeIndex + 1) % Math.min(gameIds.length, gameIdsLimit);
      setActiveIndex(nextIndex);
    }, 5000); // Altere 2000 para o intervalo desejado (aqui, 2 segundos)

    return () => {
      clearInterval(intervalId);
    };
  }, [activeIndex, gameIds]);

  const handleToggle = (gameId) => {
    // Adicione a lógica para detalhes do jogo conforme necessário
    console.log(`Detalhes do jogo com ID ${gameId}`);
  };

  const handleLoopNext = () => {
    const gameIdsLimit = 3; // Define o limite desejado
    const nextIndex = (activeIndex + 1) % Math.min(gameIds.length, gameIdsLimit);

    if (nextIndex === 0) {
      // Se o próximo índice seria 0, reinicie o loop
      setActiveIndex(0);
    } else {
      setActiveIndex(nextIndex);
    }
  };

  const handleLoopPrev = () => {
    const gameIdsLimit = 3; // Define o limite desejado
    const prevIndex = (activeIndex - 1 + gameIds.length) % Math.min(gameIds.length, gameIdsLimit);

    if (prevIndex === gameIdsLimit - 1) {
      // Se o índice anterior seria gameIdsLimit - 1 (último jogo), reinicie o loop
      setActiveIndex(0);
    } else {
      setActiveIndex(prevIndex);
    }
  };

  return (
    <div>
      <div>
        <h1>Página Inicial</h1>
        <div className="container">
          {gameIds.slice(0, 3).map((gameId, index) => (
            <FeaturedGame
              key={gameId}
              gameId={gameId}
              isActive={index === activeIndex}
              onToggle={handleToggle}
              onNext={handleLoopNext}
              onPrev={handleLoopPrev}
              limit={3}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              gameIds={gameIds}
            />
          ))}
        </div>
        {/* <GameHighlights /> */}
      </div>
    </div>
  );
};

export default Home;
