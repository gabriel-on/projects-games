import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';

const UserLevel = ({ userId, userPoints, userAchievements, confirmLevelUp, setConfirmLevelUp }) => {
  const [userLevel, setUserLevel] = useState(null);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);
  const [totalPointsToNextLevel, setTotalPointsToNextLevel] = useState(0);
  const basePointsPerLevel = 75;
  const basePointsIncreaseEveryNLevels = 5;

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

  const handleLevelUpConfirmation = async () => {
    try {
      // Atualiza o estado para ocultar o botão de confirmação
      setConfirmLevelUp(false);

      // Salva os pontos do usuário em "usersLevel"
      const db = getDatabase();
      const userLevelRef = ref(db, `usersLevel/${userId}/level`);
      set(userLevelRef, userLevel + 1); // Aumenta o nível em 1

      // Atualiza os pontos de todas as conquistas para 0
      const achievementsRef = ref(db, `userAchievements/${userId}`);
      const snapshot = await get(achievementsRef);

      if (snapshot.exists()) {
        const userAchievements = snapshot.val();

        for (const achievementId in userAchievements) {
          userAchievements[achievementId].points = 0;
        }

        set(achievementsRef, userAchievements);
      }

      // Zera os pontos do usuário após salvar o novo nível
      setTotalPointsToNextLevel(0);
    } catch (error) {
      console.error('Erro ao confirmar subida de nível:', error.message);
    }
  };

  useEffect(() => {
    // Calcula o total de pontos necessários para atingir o próximo nível
    const levelsSinceLastIncrease = Math.floor(userLevel / basePointsIncreaseEveryNLevels);
    const adjustedBasePointsPerLevel = basePointsPerLevel + levelsSinceLastIncrease;
    const totalPoints = (userLevel + 1) * adjustedBasePointsPerLevel;
    setTotalPointsToNextLevel(totalPoints);

    // Calcula quantos pontos faltam para o próximo nível
    const remainingPoints = totalPoints - userPoints;
    setPointsToNextLevel(remainingPoints);
  }, [userPoints, userLevel, basePointsPerLevel, basePointsIncreaseEveryNLevels]);

  useEffect(() => {
    // Exibe o botão de confirmação apenas quando o usuário tem pontos suficientes para subir de nível
    setConfirmLevelUp(userPoints >= totalPointsToNextLevel);
  }, [userPoints, setConfirmLevelUp, totalPointsToNextLevel]);

  return (
    <div>
      {userLevel !== null && (
        <div>
          <p>Nível: {userLevel}</p>
        </div>
      )}
      <p>Total de pontos disponíveis: {userPoints}</p>
      <div>
        <p>Faltam {pointsToNextLevel} pontos para o próximo nível.</p>
        <p>Você realmente deseja subir de nível?</p>
        <button
          onClick={handleLevelUpConfirmation}
          disabled={userPoints < totalPointsToNextLevel}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default UserLevel;
