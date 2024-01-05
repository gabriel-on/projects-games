import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';

const PAGE_SIZE = 5; // Número de jogos por página

const LatestAdded = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'oldest'

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

          // Verificar se a propriedade createdAt está presente antes de ordenar
          const gamesWithCreatedAt = gamesArray.filter(game => game.createdAt);

          // Ordenar os jogos com base na escolha do usuário
          const sortedGames = gamesWithCreatedAt.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            if (sortBy === 'recent') {
              return dateB - dateA; // Do mais recente para o mais antigo
            } else {
              return dateA - dateB; // Do mais antigo para o mais recente
            }
          });

          setGames(sortedGames);
        } else {
          console.log('Nenhum jogo encontrado.');
        }
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchGamesData();
  }, [sortBy]);

  const totalPages = Math.ceil(games.length / PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div>
      <h1>Games Adicionados:</h1>
      <div>
        <button onClick={() => handleSortChange('recent')}>Mais Recente</button>
        <button onClick={() => handleSortChange('oldest')}>Mais Antigo</button>
      </div>
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
