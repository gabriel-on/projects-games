// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

import EditGame from '../../components/EditGame/EditGane';

import '../AddGame/AddGame.css';

function Dashboard() {
  const [games, setGames] = useState([]);

  const navigate = useNavigate();
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const database = getDatabase();
      const gamesRef = ref(database, 'games');

      onValue(gamesRef, (snapshot) => {
        const gamesData = snapshot.val();
        if (gamesData) {
          const gamesArray = Object.entries(gamesData).map(([id, game]) => ({
            id,
            ...game
          }));
          setGames(gamesArray);
        }
      });
    };

    fetchGames();
  }, []);

  const handleEdit = (gameId) => {
    setSelectedGameId(gameId);
    navigate(`/edit/${gameId}`);
  };

  const handleDelete = (gameId) => {
    setSelectedGameId(gameId);
    navigate(`/delete/${gameId}`);
  };

  return (
    <div>
      <h2>Lista de Jogos</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <strong>{game.title}</strong>
            <img src={game.image} alt="" />
            <button onClick={() => handleEdit(game.id)}>Editar</button>
            <button onClick={() => handleDelete(game.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      {selectedGameId && <EditGame gameId={selectedGameId} />}
    </div>
  );
}

export default Dashboard;
