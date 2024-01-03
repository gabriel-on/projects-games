// GameStatus.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, onValue, update } from 'firebase/database';

const GameStatus = ({ gameId }) => {
  const { currentUser } = useAuth();
  const [gameStatus, setGameStatus] = useState('none');
  const [selectedStatus, setSelectedStatus] = useState('none');

  useEffect(() => {
    if (currentUser) {
      loadGameStatus(currentUser.uid, gameId);
    }
  }, [currentUser, gameId]);

  useEffect(() => {
    // Atualiza o estado selectedStatus sempre que o gameStatus muda
    setSelectedStatus(gameStatus);
  }, [gameStatus]);

  const loadGameStatus = (userId, gameId) => {
    try {
      const db = getDatabase();
      const gamesRef = ref(db, `games/${gameId}/userStatus`);

      onValue(gamesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setGameStatus(data[userId] || 'none');
        } else {
          // Cria os status padrão se não existirem
          const defaultStatus = {
            [userId]: 'none',
            // Adicione mais status padrão conforme necessário
          };
          update(gamesRef, defaultStatus);
          setGameStatus(defaultStatus[userId]);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar status do jogo:', error.message);
    }
  };

  const handleChangeStatus = () => {
    try {
      const db = getDatabase();
      const gamesRef = ref(db, `games/${gameId}/userStatus`);
      update(gamesRef, { [currentUser.uid]: selectedStatus });
      setGameStatus(selectedStatus);
    } catch (error) {
      console.error('Erro ao atualizar status do jogo:', error.message);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div>
      {gameStatus !== null && (
        <div>
          <p>Status do Jogo: {gameStatus}</p>
          {/* Dropdown para escolher o status */}
          <select value={selectedStatus} onChange={handleStatusChange}>
            <option value="none">Nenhum</option>
            <option value="planning">Planejando</option>
            <option value="playing">Jogando</option>
            <option value="played">Jogado</option>
            {/* Adicione mais opções conforme necessário */}
          </select>
          <button onClick={handleChangeStatus}>Salvar</button>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
