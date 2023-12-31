// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import FeaturedGame from '../../components/FeaturedGame/FeaturedGame.jsx';
import GameHighlights from '../../components/GameHighlights/GameHighlights.jsx';
import NewsUpdates from '../../components/NewsUpdates/NewsUpdates.jsx';
import CommunityActivity from '../../components/CommunityActivity/CommunityActivity.jsx';
import EventsTournaments from '../../components/EventsTournaments/EventsTournaments.jsx';
import FeaturedReviews from '../../components/FeaturedReviews/FeaturedReviews.jsx';
import MediaSection from '../../components/MediaSection/MediaSection.jsx';
import { getDatabase, ref, get } from 'firebase/database';

import '../../pages/Home/Home.css';

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
          const ids = Object.keys(data);
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
    const intervalId = setInterval(() => {
      const nextIndex = (activeIndex + 1) % gameIds.length;
      setActiveIndex(nextIndex);
    }, 5000); // Altere 5000 para o intervalo desejado (aqui, 5 segundos)

    return () => {
      clearInterval(intervalId);
    };
  }, [activeIndex, gameIds]);

  const handleToggle = (gameId) => {
    // Adicione a lógica para detalhes do jogo conforme necessário
    console.log(`Detalhes do jogo com ID ${gameId}`);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % gameIds.length;
    setActiveIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + gameIds.length) % gameIds.length;
    setActiveIndex(prevIndex);
  };

  return (
    <div>
      <div>
        <h1>Página Inicial</h1>
        <div className="container">
          {gameIds.map((gameId, index) => (
            <FeaturedGame
              key={gameId}
              gameId={gameId}
              isActive={index === activeIndex}
              onToggle={handleToggle}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          ))}
        </div>
        <GameHighlights />
        <NewsUpdates />
        <CommunityActivity />
        <EventsTournaments />
        <FeaturedReviews />
        <MediaSection />
      </div>
    </div>
  );
};

export default Home;
