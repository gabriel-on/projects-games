import { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';

const useAchievements = (userId) => {
  const [userAchievements, setUserAchievements] = useState(null);

  useEffect(() => {
    const fetchUserAchievements = async () => {
      try {
        const database = getDatabase();
        const userAchievementsRef = ref(database, `userAchievements/${userId}`);
        const snapshot = await get(userAchievementsRef);

        if (snapshot.exists()) {
          setUserAchievements(snapshot.val());
        } else {
          console.log('Nenhuma conquista encontrada para o usuário.');
        }
      } catch (error) {
        console.error('Erro ao buscar conquistas do usuário:', error);
      }
    };

    fetchUserAchievements();
  }, [userId]);

  const unlockAchievement = async (achievementId, achievementData) => {
    try {
      const database = getDatabase();
      const userAchievementRef = ref(database, `userAchievements/${userId}/${achievementId}`);

      // Atualizar dados do usuário para indicar que a conquista foi desbloqueada
      await set(userAchievementRef, true);

      // Pode ser útil atualizar localmente o estado das conquistas do usuário
      setUserAchievements((prevAchievements) => ({ ...prevAchievements, [achievementId]: true }));

      console.log(`Conquista ${achievementId} desbloqueada para o usuário ${userId}.`);

      // Você pode fazer mais coisas aqui, como exibir uma notificação, etc.
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
    }
  };

  return { userAchievements, unlockAchievement };
};

export default useAchievements;
