import React, { useEffect, useState } from 'react';

const UserLevel = ({ userPoints, userAchievements }) => {
  const [userLevel, setUserLevel] = useState(1);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const pointsPerLevel = 50;

  useEffect(() => {
    // Soma os pontos das conquistas para calcular os pontos totais
    const achievementsPoints = Object.values(userAchievements).reduce(
      (acc, achievement) => acc + (achievement.points || 0),
      0
    );
  
    // Certifique-se de que userPoints seja um número válido
    const totalUserPoints = typeof userPoints === 'number' && !isNaN(userPoints) ? userPoints : 0;
  
    // Garante que os pontos totais são um número válido
    const totalPoints = totalUserPoints + achievementsPoints;
  
    if (!isNaN(totalPoints) && totalPoints >= 0) {
      const newLevel = Math.floor(totalPoints / pointsPerLevel);
      setUserLevel(newLevel);
  
      const pointsToNext = pointsPerLevel - (totalPoints % pointsPerLevel);
      setPointsToNextLevel(pointsToNext);
    } else {
      // Em caso de pontos inválidos, exibe uma mensagem de erro ou define um valor padrão
      console.error('Pontos inválidos:', totalPoints);
      // Você pode definir um valor padrão ou exibir uma mensagem de erro para o usuário
    }
  }, [userPoints, userAchievements, pointsPerLevel]);

  return (
    <div>
      <p>Nível: {userLevel}</p>
      <p>Faltam {pointsToNextLevel} Pontos para o próximo nível</p>
    </div>
  );
};

export default UserLevel;
