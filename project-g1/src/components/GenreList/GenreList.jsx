import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getDatabase, ref, get } from 'firebase/database';

const GenreList = () => {
  const { genre } = useParams();
  const [games, setGames] = useState([]);
  const decodedGenre = decodeURIComponent(genre);

  const fetchGames = async () => {
    const database = getDatabase();
    const gamesRef = ref(database, 'games');
  
    try {
      // Consulta para obter jogos com gênero específico
      const snapshot = await get(gamesRef);
  
      if (snapshot.exists()) {
        const gamesData = snapshot.val();
  
        // Filtrar jogos pelo gênero fornecido
        const filteredGames = Object.keys(gamesData)
          .filter(key => gamesData[key].genres && gamesData[key].genres.includes(decodedGenre))
          .map(key => ({ ...gamesData[key], id: key }));
  
        setGames(filteredGames);
      } else {
        console.error(`Nenhum jogo encontrado para o gênero ${decodedGenre}`);
      }
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
    }
  };  

  useEffect(() => {
    fetchGames();
  }, [decodedGenre]);

  return (
    <div>
      <h2>{`Jogos de ${decodedGenre}`}</h2>
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
