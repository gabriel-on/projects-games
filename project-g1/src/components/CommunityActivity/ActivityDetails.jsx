import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import FullActivityView from './FullActivityView';

function ActivityDetails() {
  const [activity, setActivity] = useState(null);
  const { activityId } = useParams();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const db = getDatabase();
        const activityRef = ref(db, `communityActivities/${activityId}`);

        const snapshot = await get(activityRef);
        const activityData = snapshot.val();

        if (activityData) {
          setActivity(activityData);
        } else {
          console.error('Atividade não encontrada.');
          // Lógica de tratamento quando a atividade não é encontrada
        }
      } catch (error) {
        console.error('Erro ao buscar atividade:', error.message);
        // Lógica de tratamento de erro, se necessário
      }
    };

    fetchActivity();
  }, [activityId]);

  const handlePostResponse = (responseText) => {
    // Adicione aqui a lógica para postar a resposta
    console.log('Postando resposta:', responseText);
  };

  const handleCloseFullActivity = () => {
  };

  return (
    <div>
      {activity && (
        <FullActivityView activity={activity} onPostResponse={handlePostResponse} onClose={handleCloseFullActivity} />
      )}
    </div>
  );
}

export default ActivityDetails;