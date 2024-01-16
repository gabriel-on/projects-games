import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';

const UserLevel = ({ userId, userPoints, confirmLevelUp, setConfirmLevelUp, currentUser }) => {
  const [userLevel, setUserLevel] = useState(null);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const [totalPointsToNextLevel, setTotalPointsToNextLevel] = useState(0);
  const basePointsPerLevel = 50;
  const pointsLimitPerLevel = 50;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const userLevelRef = ref(db, `usersLevel/${userId}/level`);
        const snapshot = await get(userLevelRef);

        if (snapshot.exists()) {
          const level = snapshot.val();
          setUserLevel(level);
        }
      } catch (error) {
        console.error('Erro ao buscar nível do usuário:', error.message);
      }
    };

    fetchData();
  }, [userId, confirmLevelUp]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const db = getDatabase();
        const achievementsRef = ref(db, `userAchievements/${userId}`);
        const snapshot = await get(achievementsRef);

        if (snapshot.exists()) {
          const userAchievements = snapshot.val();

          // Calcula os pontos totais de conquista
          const totalAchievementPoints = Object.values(userAchievements)
            .reduce((total, achievement) => total + (achievement.points || 0), 0);

          // Atualiza o estado de userPoints com a soma dos pontos de conquista
          setTotalPointsToNextLevel(totalAchievementPoints);
        }
      } catch (error) {
        console.error('Erro ao buscar pontos de conquista do usuário:', error.message);
      }
    };

    fetchAchievements();
  }, [userId, userPoints, confirmLevelUp]);

  useEffect(() => {
    if (userLevel != null && basePointsPerLevel != null && basePointsPerLevel !== 0) {
      const totalPoints = (userLevel + 1) * basePointsPerLevel;
      const limitedTotalPoints = Math.min(totalPoints, pointsLimitPerLevel);
      setTotalPointsToNextLevel(limitedTotalPoints);

      const remainingPoints = limitedTotalPoints - userPoints;
      setPointsToNextLevel(remainingPoints);

      setConfirmLevelUp(userPoints >= limitedTotalPoints);
    }
  }, [userPoints, userLevel, basePointsPerLevel, setConfirmLevelUp, pointsLimitPerLevel]);

  const handleLevelUpConfirmation = async () => {
    try {
      setConfirmLevelUp(false);
  
      const db = getDatabase();
      const userLevelRef = ref(db, `usersLevel/${userId}/level`);
  
      // Obter o nível atual do usuário
      const snapshot = await get(userLevelRef);
      const currentLevel = snapshot.exists() ? snapshot.val() : 0;
  
      // Calcular quantos níveis o usuário pode subir com os pontos disponíveis
      const levelsToUp = Math.floor(userPoints / basePointsPerLevel);
  
      if (levelsToUp > 0) {
        // Subir de múltiplos níveis somando
        await set(userLevelRef, currentLevel + levelsToUp);
  
        // Atualizar os pontos no próximo nível se houver pontos restantes
        const remainingPoints = userPoints % basePointsPerLevel;
        if (remainingPoints > 0) {
          const nextLevelRef = ref(db, `usersLevel/${userId}/${currentLevel + levelsToUp + 1}/points`);
  
          // Obter os pontos existentes no próximo nível (se houver)
          const nextLevelSnapshot = await get(nextLevelRef);
          const existingPoints = nextLevelSnapshot.exists() ? nextLevelSnapshot.val() : 0;
  
          // Adicionar os pontos restantes aos pontos existentes no próximo nível
          await set(nextLevelRef, existingPoints + remainingPoints);
        }
  
        // Zerar os pontos de cada conquista individualmente
        const achievementsRef = ref(db, `userAchievements/${userId}`);
        const achievementsSnapshot = await get(achievementsRef);
  
        if (achievementsSnapshot.exists()) {
          const userAchievements = achievementsSnapshot.val();
  
          for (const achievementId in userAchievements) {
            const achievementRef = ref(db, `userAchievements/${userId}/${achievementId}/points`);
            await set(achievementRef, 0);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao confirmar subida de nível:', error.message);
    }
  };  

  return (
    <div>
      {userLevel !== null && (
        <div>
          <p>Nível: {userLevel}</p>
        </div>
      )}
      {currentUser.uid === userId && (
        <div>
          <p>Total de pontos disponíveis: {totalPointsToNextLevel}</p>
          <p>Faltam {pointsToNextLevel} pontos para o próximo nível.</p>
          <p>Você realmente deseja subir de nível?</p>
          <button
            onClick={handleLevelUpConfirmation}
            disabled={userPoints < !confirmLevelUp}
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserLevel;
