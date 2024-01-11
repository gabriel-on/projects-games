import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';

const UserLevel = ({ userId, userPoints, confirmLevelUp, setConfirmLevelUp }) => {
  const [confirmedUserLevel, setConfirmedUserLevel] = useState(null);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const [totalPointsToNextLevel, setTotalPointsToNextLevel] = useState(0);
  const basePointsPerLevel = 25;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const userLevelRef = ref(db, `usersLevel/${userId}/level`);
        const snapshot = await get(userLevelRef);

        if (snapshot.exists()) {
          const userLevel = snapshot.val();
          setConfirmedUserLevel(userLevel);
        }
      } catch (error) {
        console.error('Erro ao buscar nível do usuário:', error.message);
      }
    };

    fetchData();
  }, [userId, confirmLevelUp]);

  const handleLevelUpConfirmation = async () => {
    try {
      // Adicione aqui a lógica para subir de nível, se necessário
      // ...

      // Atualiza o estado para ocultar o botão de confirmação
      setConfirmLevelUp(false);

      // Salva os pontos do usuário em "usersLevel"
      const db = getDatabase();
      const userLevelRef = ref(db, `usersLevel/${userId}/level`);
      set(userLevelRef, confirmedUserLevel + 1); // Aumenta o nível em 1 e salva no banco de dados

      // Zera os pontos do usuário
      setTotalPointsToNextLevel(0);
    } catch (error) {
      console.error('Erro ao confirmar subida de nível:', error.message);
    }
  };

  useEffect(() => {
    // Calcula quantos pontos faltam para o próximo nível
    const remainingPoints = basePointsPerLevel - (userPoints % basePointsPerLevel);
    setPointsToNextLevel(remainingPoints);

    // Calcula o total de pontos necessários para atingir o próximo nível
    const totalPoints = remainingPoints + userPoints;
    setTotalPointsToNextLevel(totalPoints || 0); // Mostra 0 se totalPoints for falsy
  }, [userPoints]);

  useEffect(() => {
    // Exibe o botão de confirmação apenas quando o usuário atingir exatamente 50 pontos
    if (userPoints % basePointsPerLevel === 0 && userPoints > 0) {
      setConfirmLevelUp(true);
    }
  }, [userPoints, setConfirmLevelUp]);

  return (
    <div>
      {confirmedUserLevel !== null && (
        <div>
          <p>Nível: {confirmedUserLevel}</p>
        </div>
      )}
      <p>Total de pontos disponíveis: {totalPointsToNextLevel}</p>
      {confirmLevelUp && confirmedUserLevel === null && (
        <div>
          <p>Faltam {pointsToNextLevel} pontos para o próximo nível.</p>
          <p>Você realmente deseja subir de nível?</p>
          <button onClick={handleLevelUpConfirmation}>Confirmar</button>
          <button onClick={() => setConfirmLevelUp(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default UserLevel;
