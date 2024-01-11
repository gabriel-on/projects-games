import React, { useState, useEffect } from 'react';
import useInteractions from '../../hooks/useInteractions';
import useAchievements from '../../hooks/useAchievements ';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, set, get } from 'firebase/database';
import AchievementMessage from '../Achievements/AchievementMessage';

const GameStatus = ({ gameId }) => {
  const { currentUser } = useAuth();
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

  const { unlockAchievement } = useAchievements(currentUser?.uid);

  const [isLogged, setIsLogged] = useState(!currentUser);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [achievementUnlockedMessage, setAchievementUnlockedMessage] = useState('');

  const saveUserAchievement = async (userId, achievementId, achievementDetails) => {
    const database = getDatabase();
    const userAchievementRef = ref(database, `userAchievements/${userId}/${achievementId}`);
    await set(userAchievementRef, achievementDetails);
  };

  const handleSaveChangesClick = async () => {
    if (isLogged) {
      setIsLogged(false);
      await handleSaveChanges();

      // Verificar se é a primeira interação do usuário
      const userAchievementRef = ref(getDatabase(), `userAchievements/${currentUser?.uid}/FirstInteractionGameId`);
      const userAchievementSnapshot = await get(userAchievementRef);

      if (!userAchievementSnapshot.exists()) {
        // Desbloquear a conquista aqui
        await unlockAchievement('FirstInteractionGameId');

        // Salvar detalhes da conquista no nó específico do usuário
        await saveUserAchievement(currentUser?.uid, 'FirstInteractionGameId', {
          name: "O Começo",
          description: "Interaja com um jogo pela primeira vez!",
          points: 75,
        });

        // Mostrar a mensagem de conquista desbloqueada
        setAchievementUnlockedMessage('Conquista desbloqueada: "O Começo"');

        setTimeout(() => {
          setAchievementUnlockedMessage('');
        }, 15000);
      }
    } else {
      setShowLoginMessage(true);
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 15000);
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
            <option value="re-playing">Re-jogando</option>
            <option value="pause">Pausando</option>
            <option value="quit">Desistindo</option>
            <option value="played">Jogou</option>
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

      {/* Botões para interações do usuário */}
      <button onClick={handleToggleFavorite}>
        {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
      </button>

      <button onClick={handleSaveChangesClick} disabled={!pendingChanges}>
        Salvar Alterações
      </button>

      {/* Mensagem de login */}
      {!isLogged && showLoginMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Você precisa estar logado para salvar alterações.
        </div>
      )}

      {/* Mensagem da conquista desbloqueada no topo do site */}
      {achievementUnlockedMessage && (
        <AchievementMessage message={achievementUnlockedMessage} details={{
          name: "O Começo",
          description: "Interaja com um jogo pela primeira vez!",
          points: 75,
        }} />
      )}
    </div>
  );
};

export default GameStatus;
