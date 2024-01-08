import React, { useEffect, useState } from 'react';

const UserLevel = ({ userPoints }) => {
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    // Atualizar o nível do usuário com base nos pontos totais
    const newLevel = Math.floor(userPoints / 100) + 1;
    setUserLevel(newLevel);
  }, [userPoints]);

  return (
    <div>
      <p>Nível: {userLevel}</p>
      {/* Você pode adicionar mais informações sobre o nível, se necessário */}
    </div>
  );
};

export default UserLevel;