import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';

const FirstInteractionGame = ({ userId, FirstInteractionGameId, onFirstInteraction }) => {
  const [achievementData, setAchievementData] = useState(null);

  useEffect(() => {
    const database = getDatabase();
    const achievementRef = ref(database, `achievements/${FirstInteractionGameId}`);

    // Consultar dados da conquista
    get(achievementRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAchievementData(data);

          // Atualizar dados do usuário para indicar que a conquista foi desbloqueada
          const userAchievementsRef = ref(database, `userAchievements/${userId}/${FirstInteractionGameId}`);
          set(userAchievementsRef, true)
            .then(() => {
              console.log('Dados do usuário atualizados para indicar conquista desbloqueada.');
            })
            .catch((error) => {
              console.error('Erro ao atualizar dados do usuário:', error);
            });
        } else {
          console.log('Conquista não encontrada.');
        }
      })
      .catch((error) => {
        console.error('Erro ao consultar dados da conquista:', error);
      });
  }, [userId, FirstInteractionGameId, onFirstInteraction]);

  if (!achievementData) {
    return null; // Aguardando dados da conquista
  }

  return (
    <div>
      <h2>Conquista Desbloqueada!</h2>
      <div>
        <p>Você desbloqueou a conquista "{achievementData.name}" ao interagir com um jogo pela primeira vez.</p>
        <p>Descrição: {achievementData.description}</p>
        <p>Pontos: {achievementData.points}</p>
      </div>
    </div>
  );
};

export default FirstInteractionGame;