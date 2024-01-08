import React, { useEffect, useState } from 'react';

const UserLevel = ({ userPoints }) => {
  const [userLevel, setUserLevel] = useState(1);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);

  useEffect(() => {
    // Definir o número de pontos necessários por nível
    const pointsPerLevel = 50;

    // Calcular o nível do usuário com base nos pontos totais
    const newLevel = Math.floor(userPoints / pointsPerLevel);
    setUserLevel(newLevel);

    // Calcular os pontos restantes até o próximo nível
    const pointsToNext = pointsPerLevel - (userPoints % pointsPerLevel);
    setPointsToNextLevel(pointsToNext);
  }, [userPoints]);

  return (
    <div>
      <p>Nível: {userLevel}</p>
      <p>Faltam {pointsToNextLevel} Pontos para o próximo nível</p>
      {/* Você pode adicionar mais informações sobre o nível, se necessário */}
    </div>
  );
};

export default UserLevel;
