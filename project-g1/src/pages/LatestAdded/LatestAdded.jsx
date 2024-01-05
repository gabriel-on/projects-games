// AllGames.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';

const PAGE_SIZE = 5; // Número de jogos por página

const LatestAdded = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const database = getDatabase();
        const gamesRef = ref(database, 'games');
  
        const snapshot = await get(gamesRef);
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          const gamesArray = Object.entries(data)
            .map(([gameId, gameData]) => ({
              id: gameId,
              ...gameData,
            }));
  
          // Ordenar os jogos por data de criação (supondo que você tenha uma propriedade createdAt)
          gamesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
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

  const totalPages = Math.ceil(games.length / PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Últimos Jogos Adicionados:</h1>
      <Link to={"/genres"}>Procure por gênero:</Link>
      <ul>
        {games
          .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
          .map((game) => (
            <li key={game.id}>
              <Link to={`/game/${game.id}`}>
                <h3>{game.title}</h3>
                <img src={game.image} alt={game.title} style={{ maxWidth: '20%' }} />
                <p>{game.description}</p>
              </Link>
            </li>
          ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default LatestAdded;
