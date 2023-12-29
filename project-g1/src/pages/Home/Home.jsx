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

  return (
    <div>
      <div>
        <h1>Página Inicial</h1>
        {gameIds.map((gameId) => (
          <FeaturedGame key={gameId} gameId={gameId} />
        ))}
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
