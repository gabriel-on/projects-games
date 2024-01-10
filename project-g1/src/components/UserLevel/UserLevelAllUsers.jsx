import React, { useEffect, useState } from 'react';
import UserAchievementsList from '../UserAchievementsList/UserAchievementsList';

const UserLevelAllUsers = ({ userId }) => {
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // Função para calcular o nível do usuário com base nas conquistas e pontos
    const calculateUserLevel = (achievements) => {
      const totalPoints = achievements.reduce((acc, achievement) => {
        return acc + (achievement.points || 0);
      }, 0);

      // Lógica de cálculo do nível
      const basePointsPerLevel = 50;
      const difficultyFactor = 1;
      const adjustedPointsPerLevel = basePointsPerLevel * difficultyFactor;

      return Math.floor(totalPoints / adjustedPointsPerLevel) + 1;
    };

    // Função para receber as conquistas do componente UserAchievementsList
    const handleAchievementsLoaded = (achievements) => {
      setUserPoints(calculateUserLevel(achievements));
    };

    // Renderiza o componente UserAchievementsList e passa a função de callback
    return <UserAchievementsList userId={userId} onAchievementsLoaded={handleAchievementsLoaded} />;
  }, [userId]);

  return (
    <div>
      <p>Nível: {userPoints}</p>
    </div>
  );
};

export default UserLevelAllUsers;
