// Leaderboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const database = getDatabase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const usersData = Object.entries(usersSnapshot.val()).map(
            ([userId, userData]) => ({
              userId,
              displayName: userData.displayName,
            })
          );

          // Fetch data from usersLevel
          const usersLevelRef = ref(database, 'usersLevel');
          const usersLevelSnapshot = await get(usersLevelRef);

          if (usersLevelSnapshot.exists()) {
            const mergedData = usersData.map(user => {
              const userLevelData = usersLevelSnapshot.val()[user.userId];
              return { ...user, level: userLevelData ? userLevelData.level : null };
            });

            // Sort users by level in descending order
            mergedData.sort((a, b) => (b.level || 0) - (a.level || 0));

            setUsers(mergedData);
          }
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchData();
  }, [database]);

  return (
    <div>
      <h2>Leaderboard</h2>

      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.displayName}</td>
              <td>{user.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;