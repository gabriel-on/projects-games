// src/components/Dashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GameList from '../../components/GameList/GameList.jsx';
import EditGame from '../../components/EditGame/EditGame.jsx';

const Dashboard = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  const handleDeleteGame = async (gameId) => {
    // Excluir o jogo do Firebase
    // Aqui, você precisará ajustar para a estrutura real do seu banco de dados
    try {
      // ... (sua lógica de exclusão aqui)
      setSelectedGame(null);
    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
    }
  };

  return (
    <div>
      <div>
        <h1>Página de Dashboard</h1>
        <div>
          <Link to="/new">Adicionar Novo Jogo</Link>
        </div>
        {/* Barra de Pesquisa */}
        <div>
          <input
            type="text"
            placeholder="Pesquisar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <h2>Lista de Jogos:</h2>
      <GameList
        searchTerm={searchTerm}
        onSelectGame={handleSelectGame}
        onDeleteGame={handleDeleteGame}
      />
      {selectedGame && <EditGame match={{ params: { id: selectedGame.id } }} />}
    </div>
  );
};

export default Dashboard;