import React, { useEffect, useState } from 'react';

const UserLevel = ({ userPoints }) => {
  const [userLevel, setUserLevel] = useState(1);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const pointsPerLevel = 50;

  useEffect(() => {
    if (typeof userPoints !== 'number' || isNaN(userPoints)) {
      return;
    }

    const newLevel = Math.floor(userPoints / pointsPerLevel);
    setUserLevel(newLevel);

    const pointsToNext = pointsPerLevel - (userPoints % pointsPerLevel);
    setPointsToNextLevel(pointsToNext);
  }, [userPoints]);

  // Adiciona um useEffect para atualizar o nível quando os pontos mudarem
  useEffect(() => {
    const newLevel = Math.floor(userPoints / pointsPerLevel);
    setUserLevel(newLevel);

    const pointsToNext = pointsPerLevel - (userPoints % pointsPerLevel);
    setPointsToNextLevel(pointsToNext);
  }, [userPoints, pointsPerLevel]);

  return (
    <div>
      <p>Nível: {userLevel}</p>
      <p>Faltam {pointsToNextLevel} Pontos para o próximo nível</p>
    </div>
  );
};

export default UserLevel;