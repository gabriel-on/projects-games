import React, { useState } from 'react';
import useInteractions from '../../hooks/useInteractions';
import { useAuth } from '../../hooks/useAuthentication';

const GameStatus = ({ gameId }) => {
  const { currentUser, getCurrentUser } = useAuth();
  const {
    userGameStatus,
    handleStatusChange,
    userClassification,
    handleClassificationChange,
    handleToggleFavorite,
    handleSaveChanges,
    isFavorite,
    pendingChanges,
  } = useInteractions(gameId);

  const [isLogged, setIsLogged] = useState(!currentUser);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleSaveChangesClick = () => {
    console.log("isLogged:", isLogged);
    if (isLogged) {
      setIsLogged(false);
      handleSaveChanges();
    } else {
      setShowLoginMessage(true);
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 3000);
    }
  };

  return (
    <div>
      {/* Exibindo a média de classificação para todos os usuários */}

      {userGameStatus !== null && (
        <div>
          <p>Status do Jogo: {userGameStatus}</p>
          <select value={userGameStatus} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="none">Nenhum</option>
            <option value="planning">Planejando</option>
            <option value="playing">Jogando</option>
            <option value="played">Jogado</option>
            {/* Adicione mais opções conforme necessário */}
          </select>
        </div>
      )}

      {/* Exibindo a classificação do usuário */}
      <label>
        Sua Classificação:
        <select value={userClassification} onChange={(e) => handleClassificationChange(e.target.value)}>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
      </label>

      <button onClick={handleToggleFavorite}>
        {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
      </button>

      <button onClick={handleSaveChangesClick} disabled={!pendingChanges}>
        Salvar Alterações
      </button>

      {showLoginMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Você precisa estar logado para salvar alterações.
        </div>
      )}
    </div>
  );
};

export default GameStatus;
