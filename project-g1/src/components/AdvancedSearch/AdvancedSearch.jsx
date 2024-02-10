import React, { useState, useEffect } from 'react';
import AdvancedSearchResults from './AdvancedSearchResults';
import { getDatabase, ref, get } from 'firebase/database';

const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState(''); // Novo estado para desenvolvedores
  const [games, setGames] = useState([]);
  const [genreGamesCount, setGenreGamesCount] = useState({});
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [developers, setDevelopers] = useState([]); // Novo estado para desenvolvedores
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

    // Função para buscar os anos disponíveis
    const fetchYears = async () => {
      const database = getDatabase();
      const gamesRef = ref(database, 'games');

      try {
        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
          const gamesData = snapshot.val();

          // Obter anos únicos dos dados dos jogos
          const uniqueYears = Array.from(
            new Set(
              Object.keys(gamesData).map(
                (key) => gamesData[key].releaseDate.substring(0, 4)
              )
            )
          );

          setYears(uniqueYears);
        } else {
          console.error('Dados de jogos não disponíveis para obter anos.');
        }
      } catch (error) {
        console.error('Erro ao buscar jogos para obter anos:', error);
      }
    };

    // Função para buscar os desenvolvedores disponíveis
    const fetchDevelopers = async () => {
      const database = getDatabase();
      const gamesRef = ref(database, 'games');

      try {
        const snapshot = await get(gamesRef);

        if (snapshot.exists()) {
          const gamesData = snapshot.val();

          // Obter desenvolvedores únicos dos dados dos jogos
          const uniqueDevelopers = Array.from(
            new Set(
              Object.keys(gamesData).map(
                (key) => gamesData[key].developers
              ).flat()
            )
          );

          setDevelopers(uniqueDevelopers);
        } else {
          console.error('Dados de jogos não disponíveis para obter desenvolvedores.');
        }
      } catch (error) {
        console.error('Erro ao buscar jogos para obter desenvolvedores:', error);
      }
    };

    fetchGenres();
    fetchYears();
    fetchDevelopers(); // Chama a função para buscar os desenvolvedores
  }, []);

  const fetchGames = async () => {
    const database = getDatabase();
    const gamesRef = ref(database, 'games');

    try {
      const snapshot = await get(gamesRef);

      if (snapshot.exists()) {
        const gamesData = snapshot.val();

        // Filtrar jogos pelo gênero selecionado, ano e desenvolvedor
        const filteredGames = Object.keys(gamesData)
          .filter(
            (key) =>
              (!selectedGenre ||
                (gamesData[key].genres &&
                  gamesData[key].genres.includes(selectedGenre))) &&
              (!selectedYear || gamesData[key].releaseDate.startsWith(selectedYear)) &&
              (!selectedDeveloper || gamesData[key].developers.includes(selectedDeveloper))
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
    // Realizar qualquer lógica de pesquisa adicional se necessário
    // Por enquanto, isso aciona a função fetchGames
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

      {/* Dropdown de seleção para anos */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option key="" value="">
          Todos os Anos
        </option>
        {years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Dropdown de seleção para desenvolvedores */}
      <select
        value={selectedDeveloper}
        onChange={(e) => setSelectedDeveloper(e.target.value)}
      >
        <option key="" value="">
          Todos os Desenvolvedores
        </option>
        {developers.map((developer, index) => (
          <option key={index} value={developer}>
            {developer}
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
