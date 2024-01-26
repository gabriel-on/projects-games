import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const HighlightedAchievements = ({ userId }) => {
  const [highlightedAchievements, setHighlightedAchievements] = useState([]);

  useEffect(() => {
    console.log('Componente HighlightedAchievements montado');

    const loadHighlightedAchievements = async () => {
      try {
        const db = getDatabase();
        const highlightedAchievementsRef = ref(db, `highlightedAchievements/${userId}`);

        onValue(highlightedAchievementsRef, (snapshot) => {
          console.log('Snapshot:', snapshot.val());

          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('Dados brutos:', data);

            const achievementsArray = Object.keys(data).map((achievementId) => ({
              id: achievementId,
              name: data[achievementId].name,  // Certifique-se de que "name" é a propriedade correta
              description: data[achievementId].description,  // Certifique-se de que "description" é a propriedade correta
            }));

            // Limita os destaques a 5
            const limitedAchievementsArray = achievementsArray.slice(0, 5);

            console.log('Dados de conquistas destacadas atualizados:', limitedAchievementsArray);

            setHighlightedAchievements(limitedAchievementsArray);
          } else {
            setHighlightedAchievements([]);
            console.log('Nenhum dado de conquista destacada encontrado.');
          }
        });
      } catch (error) {
        console.error('Erro ao carregar conquistas destacadas:', error.message);
      }
    };

    loadHighlightedAchievements();
  }, [userId]); // Adiciona userId como dependência para reagir às alterações

  return (
    <div>
      <h2>Conquistas Destacadas</h2>
      <ul>
        {highlightedAchievements.map((achievement) => (
          <li key={achievement.id}>
            <p className='user-achievement-content'>{achievement.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighlightedAchievements;
