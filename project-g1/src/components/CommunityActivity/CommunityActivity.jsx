import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import { Link } from 'react-router-dom';

function CommunityActivity() {
  const auth = useAuth();
  const currentUser = auth.currentUser;
  const [activities, setActivities] = useState([]);
  const [newActivityText, setNewActivityText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [fullActivity, setFullActivity] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const activitiesRef = ref(db, 'communityActivities');

    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const activityList = Object.values(data);
        setActivities(activityList);
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

    await set(newActivityRef, {
      id: newActivityRef.key,
      text: newActivityText,
      userId: currentUser.uid,
      displayName: currentUser.displayName,
      responses: [],
    });

    setNewActivityText('');
  };

  const handleFullActivityClick = (activity) => {
    setFullActivity(activity);
  };

  return (
    <div>
      <h2>Community Activities</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <Link to={`/activity/${activity.id}`} onClick={() => handleFullActivityClick(activity)}>
              {activity.text}
            </Link>
          </li>
        ))}
      </ul>
      {selectedActivity && (
        <div>
          <h3>Atividade Selecionada</h3>
          <p>{selectedActivity.text}</p>
          <ul>
            {Array.isArray(selectedActivity.responses) &&
              selectedActivity.responses.map((response) => (
                <li key={response.id}>{response.text}</li>
              ))}
          </ul>
        </div>
      )}
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
