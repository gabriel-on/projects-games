// src/components/Dashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GameList from '../../components/GameList/GameList.jsx';
import EditGame from '../../components/EditGame/EditGame.jsx';

const Dashboard = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSelectGame = game => {
    setSelectedGame(game);
  };

  const handleDeleteGame = async gameId => {
    // Excluir o jogo do Firebase
    // Aqui, você precisará ajustar para a estrutura real do seu banco de dados
    try {
      await db.collection('games').doc(gameId).delete();
      setSelectedGame(null);
    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
    }
  };

  return (
    <div>
      <h1>Página de Dashboard</h1>
      <Link to="/new">Adicionar Novo Jogo</Link>
      <GameList onSelectGame={handleSelectGame} onDeleteGame={handleDeleteGame} />
      {selectedGame && <EditGame match={{ params: { id: selectedGame.id } }} />}
    </div>
  );
};

export default Dashboard;
