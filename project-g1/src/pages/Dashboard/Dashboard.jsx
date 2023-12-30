// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import EditGame from './EditGame';
import DeleteGame from './DeleteGame';

import '../AddGame/AddGame.css';

function Dashboard() {
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    image: '',
    genres: [],
    consoles: [],
    rating: '',
    officialSite: ''
  });

  // ... restante do código

  const navigate = useNavigate();
  const [selectedGameId, setSelectedGameId] = useState(null);

  const navigateToEdit = (gameId) => {
    setSelectedGameId(gameId);
    navigate(`/edit/${gameId}`);
  };

  const navigateToDelete = (gameId) => {
    setSelectedGameId(gameId);
    navigate(`/delete/${gameId}`);
  };

  return (
    <div>
      <button onClick={() => navigateToEdit(selectedGameId)}>Editar Jogo</button>
      <button onClick={() => navigateToDelete(selectedGameId)}>Excluir Jogo</button>

      {selectedGameId && <EditGame gameId={selectedGameId} />}
      {selectedGameId && <DeleteGame gameId={selectedGameId} />}

      {/* Restante do conteúdo do formulário ou da página */}
      {/* ... */}
    </div>
  );
}

export default Dashboard;
