import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';

const UserLevel = ({ userId, userPoints, confirmLevelUp, setConfirmLevelUp, currentUser }) => {
  const [userLevel, setUserLevel] = useState(null);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const [totalPointsToNextLevel, setTotalPointsToNextLevel] = useState(0);
  const basePointsPerLevel = 25;
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
      await set(userLevelRef, userLevel + 1);

      const achievementsRef = ref(db, `userAchievements/${userId}`);
      const snapshot = await get(achievementsRef);

      if (snapshot.exists()) {
        const userAchievements = snapshot.val();

        // Zera os pontos de cada conquista individualmente
        for (const achievementId in userAchievements) {
          const achievementRef = ref(db, `userAchievements/${userId}/${achievementId}/points`);
          await set(achievementRef, 0);
        }
      }

      setTotalPointsToNextLevel(0);
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
