import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import '../../pages/Home/Home.css';

const PAGE_SIZE = 5; // Número de jogos por página

const AllGames = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  console.log('Renderizando componente AllGames');

  useEffect(() => {
    console.log('Estado inicial da página:', currentPage);

    const fetchGamesData = async () => {
      try {
        const database = getDatabase();
        const gamesRef = ref(database, 'games');

        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const gamesArray = Object.entries(data).map(([gameId, gameData]) => ({
            id: gameId,
            ...gameData,
          }));

          // Calcular o número total de páginas
          const calculatedTotalPages = Math.ceil(gamesArray.length / PAGE_SIZE);

          // Atualizar o estado do número total de páginas
          setTotalPages(calculatedTotalPages);

          // Armazenar o número total de páginas no localStorage
          localStorage.setItem('allGamesTotalPages', calculatedTotalPages.toString());

          // Atualizar o estado dos jogos
          setGames(gamesArray);
        } else {
          console.log('Nenhum jogo encontrado.');
        }
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchGamesData();
  }, [currentPage]);

  useEffect(() => {
    // Recuperar o número total de páginas do localStorage ao montar o componente
    const storedTotalPages = localStorage.getItem('allGamesTotalPages');
    if (storedTotalPages) {
      setTotalPages(parseInt(storedTotalPages));
      console.log('Número total de páginas recuperado do localStorage:', storedTotalPages);
    }
  }, []); // Este efeito deve executar apenas uma vez ao montar o componente

  useEffect(() => {
    // Armazenar o número total de páginas no localStorage
    localStorage.setItem('allGamesTotalPages', totalPages.toString());
    console.log('Número total de páginas armazenado no localStorage:', totalPages);
  }, [totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='all-games-container'>
      <h1>Todos os Jogos:</h1>
      <Link to={"/genres"}>Procure por gênero:</Link>
      {games.length > 0 ? (
        <>
          <ul>
            {games
              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
              .map((game) => (
                <li key={game.id}>
                  <Link to={`/game/${game.id}`}>
                    <h3>{game.title}</h3>
                    <img src={game.image} alt={game.title} style={{ maxWidth: '100%' }} />
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
        </>
      ) : (
        <p>Carregando jogos...</p>
      )}
    </div>
  );
};

export default AllGames;