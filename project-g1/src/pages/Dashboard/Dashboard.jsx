import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebase.js';
import GameList from '../../components/GameList/GameList.jsx';
import EditGame from '../../components/EditGame/EditGame.jsx';

const Dashboard = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('user'); // Valor padrão para usuários não autenticados

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = db.collection('users').doc(user.uid);

        userRef.get().then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUserRole(userData.role || 'user');
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  const handleDeleteGame = async (gameId) => {
    try {
      // Lógica de exclusão aqui
      setSelectedGame(null);
      // Adicione feedback ao usuário sobre a exclusão bem-sucedida, se necessário
    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
      // Adicione feedback ao usuário sobre o erro de exclusão, se necessário
    }
  };

  if (userRole !== 'admin') {
    // Redirecionar usuários não administradores para outra página
    return <Navigate to="/" />;
  }

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