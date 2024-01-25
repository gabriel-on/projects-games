import React, { useState, useEffect } from 'react';
import useInteractions from '../../hooks/useInteractions';
import useAchievements from '../../hooks/useAchievements ';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, set, get } from 'firebase/database';
import AchievementMessage from '../Achievements/AchievementMessage';
import LoginModal from '../AllModal/LoginModal';
import '../GamesStatus/GamesStatus.css'

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

  const [achievementUnlockedMessage, setAchievementUnlockedMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const saveUserAchievement = async (userId, achievementId, achievementDetails) => {
    const database = getDatabase();
    const userAchievementRef = ref(database, `userAchievements/${userId}/${achievementId}`);
    await set(userAchievementRef, achievementDetails);
  };

  const handleSaveChangesClick = async () => {
    if (currentUser) {
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
      // Exibir o modal apenas se o usuário não estiver autenticado
      setShowLoginModal(true);
    }
  };

  return (
    <div className='status-games-details'>
      {userGameStatus !== null && (
        <div>
          <p>Status do Jogo: {userGameStatus}</p>
          <select value={userGameStatus} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="">Nenhum</option>
            <option value="planning">Planejando</option>
            <option value="playing">Jogando</option>
            <option value="re-playing">Re-jogando</option>
            <option value="pause">Pausando</option>
            <option value="quit">Desistindo</option>
            <option value="played">Jogou</option>
          </select>
        </div>
      )}

      <label>
        Sua Classificação:
        <select value={userClassification} onChange={(e) => handleClassificationChange(e.target.value)}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>

      <button onClick={handleToggleFavorite}>
        {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
      </button>

      <button onClick={handleSaveChangesClick} disabled={!pendingChanges}>
        Salvar Alterações
      </button>

      <LoginModal showModal={showLoginModal} closeModal={() => setShowLoginModal(false)} />

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
