import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import GamesTopList from '../GamesTopList/GamesTopList';
import '../FeaturedGame/GameNavigation.css'
import { Link } from 'react-router-dom';

const GameNavigation = () => {
  const [gamesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const database = getDatabase(); // Certifique-se de que a função getDatabase está importada corretamente
        const gamesRef = ref(database, 'games');

        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const gamesArray = Object.entries(data).map(([gameId, gameData]) => ({
            id: gameId,
            ...gameData,
          }));

          setGames(gamesArray);
        } else {
          console.log('Nenhum jogo encontrado.');
        }
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchGamesData();
  }, []);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(games.length / gamesPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="game-navigation">
      <Link to={"/all-games"}>Ver mais</Link>
      <div>
        <div className="navigation-buttons">
          <button className="btn-pn" onClick={handlePrev}>
            &lt;
          </button>
        </div>
        <GamesTopList gamesPerPage={gamesPerPage} currentPage={currentPage} />
        <div className="navigation-buttons">
          <button className="btn-pn" onClick={handleNext}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameNavigation;
