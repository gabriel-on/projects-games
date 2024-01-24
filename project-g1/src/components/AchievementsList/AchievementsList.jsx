import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';

const AchievementsList = () => {
    const [achievements, setAchievements] = useState([]);
    const navigate = useNavigate(); // Hook para navegação
  
    useEffect(() => {
      // Referência para o nó 'achievements' no banco de dados Firebase
      const db = getDatabase();
      const achievementsRef = ref(db, 'achievements');
  
      // Evento de escuta para mudanças no nó 'achievements'
      const onDataChange = (snapshot) => {
        // Obtém os dados do snapshot e atualiza o estado
        const data = snapshot.val();
        if (data) {
          const achievementsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setAchievements(achievementsArray);
        }
      };
  
      onValue(achievementsRef, onDataChange);
  
      // Cleanup da escuta quando o componente é desmontado
      return () => off(achievementsRef, 'value', onDataChange);
    }, []);
  
    // Função para navegar para os detalhes da conquista
    const goToAchievementDetails = (achievementId) => {
        console.log('ID da conquista:', achievementId);
        navigate(`/achievement/${achievementId}`);
    };
  
    return (
      <div>
        <h2>Lista de Conquistas</h2>
        <ul>
          {achievements.map((achievement) => (
            <li key={achievement.id}>
              <strong>{achievement.name}</strong>
              <button onClick={() => goToAchievementDetails(achievement.id)}>Ver conquista</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default AchievementsList;
  