// Leaderboard.js
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import database from '../../firebase/firebase';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const leaderboardRef = ref(database, 'leaderboard');

    const fetchData = async () => {
      try {
        const snapshot = await get(leaderboardRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const sortedLeaderboard = Object.entries(data)
            .sort((a, b) => b[1].score - a[1].score)
            .map(([userId, userInfo]) => ({ userId, ...userInfo }));
          setLeaderboard(sortedLeaderboard);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;