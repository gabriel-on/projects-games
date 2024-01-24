import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { useParams } from 'react-router-dom';

const Achievement = () => {
  const [achievement, setAchievement] = useState(null);
  const { achievementId } = useParams();

  useEffect(() => {
    const db = getDatabase();
    const achievementsRef = ref(db, `achievements/${achievementId}`);

    const onDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setAchievement(data);
      } else {
        console.error(`Conquista com ID ${achievementId} não encontrada.`);
      }
    };

    onValue(achievementsRef, onDataChange);

    return () => off(achievementsRef, 'value', onDataChange);
  }, [achievementId]);

  if (!achievement) {
    return <p>Conquista não encontrada.</p>;
  }

  return (
    <div>
      <h2>{achievement.name}</h2>
      <div>
        <p>{achievement.description}</p>
        <p>Pontos: {achievement.points}</p>
      </div>
    </div>
  );
};

export default Achievement;
