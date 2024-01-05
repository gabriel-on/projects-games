import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getDatabase, ref, get } from 'firebase/database';

const GenreList = () => {
  const { genre } = useParams();
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genreGamesCount, setGenreGamesCount] = useState({});

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
          .filter(key => !selectedGenre || (gamesData[key].genres && gamesData[key].genres.includes(selectedGenre)))
          .map(key => ({ ...gamesData[key], id: key }));

        setGames(filteredGames);

        // Contar a quantidade de jogos para cada gênero
        const genreCounts = filteredGames.reduce((counts, game) => {
          game.genres.forEach(genre => {
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

  useEffect(() => {
    fetchGames();
  }, [selectedGenre]);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div>
      <h2>{`Jogos de ${selectedGenre || 'Todos os Gêneros'}`}</h2>

      {/* Exibir a quantidade de jogos para cada gênero */}
      <div>
        <h3>Quantidade de Jogos por Gênero:</h3>
        <ul>
          {Object.entries(genreGamesCount).map(([genre, count]) => (
            <li key={genre}>{`${genre}: ${count}`}</li>
          ))}
        </ul>
      </div>

      {/* Menu suspenso para escolher o gênero */}
      <select id="genres" name="genres" value={selectedGenre} onChange={handleGenreChange}>
        <option value="">Todos</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <p>{`Quantidade de Jogos: ${games.length}`}</p>

      <ul>
        {games.map((game) => (
          <li key={game.title}>
            <Link to={`/game/${game.id}`}>
              <img src={game.image} alt={game.title} />
              <p>{game.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;
