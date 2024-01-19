import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import { Link } from 'react-router-dom';
import LikeDislike from '../LikeDislike/LikeDislike';

function CommunityActivity() {
  const auth = useAuth();
  const currentUser = auth.currentUser;
  const [activities, setActivities] = useState([]);
  const [newActivityText, setNewActivityText] = useState('');
  const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    const db = getDatabase();
    const activitiesRef = ref(db, 'communityActivities');

    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const activityList = Object.values(data);
        setActivities(activityList);

        // Calcular o número total de respostas
        const total = activityList.reduce((acc, activity) => {
          return acc + (activity.responses ? Object.values(activity.responses).length : 0);
        }, 0);

        setTotalResponses(total);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePostActivity = async () => {
    if (newActivityText.trim() === '' || !currentUser) return;

    const db = getDatabase();
    const activitiesRef = ref(db, 'communityActivities');
    const newActivityRef = push(activitiesRef);

    const currentTime = new Date().toISOString();

    await set(newActivityRef, {
      id: newActivityRef.key,
      text: newActivityText,
      userId: currentUser.uid,
      displayName: currentUser.displayName,
      responses: [],
      timestamp: currentTime,
    });

    setNewActivityText('');
  };

  return (
    <div>
      <h2>Community Activities</h2>
      <p>Total de Respostas: {totalResponses}</p>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <Link to={`/activity/${activity.id}`}>
              {activity.text}
            </Link>
            <span> Respostas: {activity.responses ? Object.values(activity.responses).length : 0}</span>
            <span> Data e Hora: {activity.timestamp}</span>
            <LikeDislike itemId={activity.id} userId={currentUser.uid} />
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newActivityText}
          onChange={(e) => setNewActivityText(e.target.value)}
        />
        <button onClick={handlePostActivity}>
          Postar Atividade
        </button>
      </div>
    </div>
  );
}

export default CommunityActivity;
