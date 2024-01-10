import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import UserAchievementsList from '../UserAchievementsList/UserAchievementsList';
import UserLevelAllUsers from '../UserLevel/UserLevelAllUsers';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userAchievements, setUserAchievements] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase();
      const usersRef = ref(database, 'users');

      try {
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = Object.entries(snapshot.val()).map(([userId, userData]) => ({
            userId,
            userName: userData.displayName,
            score: userData.score,
          }));

          usersData.sort((a, b) => b.score - a.score);
          setLeaderboard(usersData);
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAchievementsLoaded = (achievements, userId) => {
    setUserAchievements((prevUserAchievements) => ({
      ...prevUserAchievements,
      [userId]: achievements,
    }));
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        {/* ... Restante do código do leaderboard */}
      </table>
      {/* Adicione UserAchievementsList e UserLevelAllUsers para cada usuário no leaderboard */}
      {leaderboard.map((user) => (
        <div key={user.userId}>
          <UserAchievementsList userId={user.userId} onAchievementsLoaded={(achievements) => handleAchievementsLoaded(achievements, user.userId)} />
          <UserLevelAllUsers userAchievements={userAchievements[user.userId] || []} />
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
