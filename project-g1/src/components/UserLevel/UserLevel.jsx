import React, { useEffect, useState } from 'react';

const UserLevel = ({ userPoints, userAchievements }) => {
  const [userLevel, setUserLevel] = useState(1);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const basePointsPerLevel = 50;
  const difficultyFactor = 1.5; // Fator de dificuldade, ajuste conforme necessário

  useEffect(() => {
    // Soma os pontos das conquistas para calcular os pontos totais
    const achievementsPoints = Object.values(userAchievements).reduce(
      (acc, achievement) => acc + (achievement.points || 0),
      0
    );

    // Certifique-se de que userPoints seja um número válido
    const totalUserPoints = typeof userPoints === 'number' && !isNaN(userPoints) ? userPoints : 0;

    // Ajusta a quantidade de pontos necessários para o próximo nível com base no fator de dificuldade
    const adjustedPointsPerLevel = basePointsPerLevel * difficultyFactor;

    // Garante que os pontos totais são um número válido
    const totalPoints = totalUserPoints + achievementsPoints;

    if (!isNaN(totalPoints) && totalPoints >= 0) {
      const newLevel = Math.floor(totalPoints / adjustedPointsPerLevel);
      setUserLevel(newLevel);

      const pointsToNext = adjustedPointsPerLevel - (totalPoints % adjustedPointsPerLevel);
      setPointsToNextLevel(pointsToNext);
    } else {
      // Em caso de pontos inválidos, exibe uma mensagem de erro ou define um valor padrão
      console.error('Pontos inválidos:', totalPoints);
      // Você pode definir um valor padrão ou exibir uma mensagem de erro para o usuário
    }
  }, [userPoints, userAchievements, difficultyFactor]);

  return (
    <div>
      <p>Nível: {userLevel}</p>
      <p>Faltam {pointsToNextLevel} Pontos para o próximo nível</p>
    </div>
  );
};

export default UserLevel;
