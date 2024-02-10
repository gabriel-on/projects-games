import React, { useState, useEffect } from 'react';
import AdvancedSearchResults from './AdvancedSearchResults';
import { getDatabase, ref, get } from 'firebase/database';

const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [games, setGames] = useState([]);
  const [genreGamesCount, setGenreGamesCount] = useState({});
  const [genres, setGenres] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Função para buscar os gêneros disponíveis
    const fetchGenres = async () => {
      const database = getDatabase();
      const genresRef = ref(database, 'genres');

      try {
        const snapshot = await get(genresRef);

        if (snapshot.exists()) {
          const genresData = snapshot.val();
          const availableGenres = Object.values(genresData);
          setGenres(availableGenres);
        } else {
          console.error('Nenhum gênero encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    };

    fetchGenres();
  }, []);

  const fetchGames = async () => {
    const database = getDatabase();
    const gamesRef = ref(database, 'games');

    try {
      const snapshot = await get(gamesRef);

      if (snapshot.exists()) {
        const gamesData = snapshot.val();

        // Filtrar jogos pelo gênero selecionado
        const filteredGames = Object.keys(gamesData)
          .filter(
            (key) =>
              !selectedGenre ||
              (gamesData[key].genres &&
                gamesData[key].genres.includes(selectedGenre))
          )
          .map((key) => ({ ...gamesData[key], id: key }));

        setGames(filteredGames);

        // Contar a quantidade de jogos para cada gênero
        const genreCounts = filteredGames.reduce((counts, game) => {
          game.genres.forEach((genre) => {
            counts[genre] = (counts[genre] || 0) + 1;
          });
          return counts;
        }, {});

        setGenreGamesCount(genreCounts);
      } else {
        console.error('Dados de jogos não disponíveis.');
      }
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
    }
  };

  const handleSearch = () => {
    fetchGames();
    setShowResults(true); // Exibir os resultados após a pesquisa
  };

  return (
    <div>
      {/* Dropdown de seleção para gêneros */}
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        <option key="" value="">
          Todos os Gêneros
        </option>
        {genres.map((genre, index) => (
          <option key={index} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <button onClick={handleSearch}>Pesquisar</button>

      {showResults && (
        <div>
          <h3>Quantidade de Jogos por Gênero:</h3>
          <ul>
            {Object.entries(genreGamesCount).map(([genre, count]) => (
              <li key={genre}>{`${genre}: ${count}`}</li>
            ))}
          </ul>

          <AdvancedSearchResults results={games} />
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;