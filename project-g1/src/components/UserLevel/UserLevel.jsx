import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

const UserLevel = ({ userPoints, userAchievements, userId }) => {
  const [userLevel, setUserLevel] = useState(1);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const basePointsPerLevel = 50;
  const difficultyFactor = 1;

  useEffect(() => {
    const achievementsPoints = Object.values(userAchievements).reduce(
      (acc, achievement) => acc + (achievement.points || 0),
      0
    );

    const totalUserPoints = typeof userPoints === 'number' && !isNaN(userPoints) ? userPoints : 0;
    const adjustedPointsPerLevel = basePointsPerLevel * difficultyFactor;

    const totalPoints = totalUserPoints + achievementsPoints;

    if (!isNaN(totalPoints) && totalPoints >= 0) {
      const newLevel = Math.floor(totalPoints / adjustedPointsPerLevel);
      setUserLevel(newLevel);

      const pointsToNext = adjustedPointsPerLevel - (totalPoints % adjustedPointsPerLevel);
      setPointsToNextLevel(pointsToNext);

      // Salva o novo nível no banco de dados com o ID do usuário
      const db = getDatabase();
      const userLevelRef = ref(db, `usersLevel/${userId}/level`);
      set(userLevelRef, newLevel);
    } else {
      console.error('Pontos inválidos:', totalPoints);
    }
  }, [userPoints, userAchievements, userId]);

  return (
    <div>
      <p>Nível: {userLevel}</p>
      {pointsToNextLevel > 0 ? (
        <p>Faltam {pointsToNextLevel} Pontos para o próximo nível</p>
      ) : (
        <p>Parabéns! Você atingiu o nível máximo.</p>
      )}
    </div>
  );
};

export default UserLevel;
