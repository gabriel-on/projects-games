// Leaderboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import './Members.css'

const Members = () => {
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
              nameColor: userData.nameColor,
            })
          );

          // Fetch data from usersLevel
          const usersLevelRef = ref(database, 'usersLevel');
          const usersLevelSnapshot = await get(usersLevelRef);

          // Fetch data from userRankings
          const userRankingsRef = ref(database, 'userRankings');
          const userRankingsSnapshot = await get(userRankingsRef);

          if (usersLevelSnapshot.exists() && userRankingsSnapshot.exists()) {
            const mergedData = usersData.map(user => {
              const userLevelData = usersLevelSnapshot.val()[user.userId];
              const userRankingsData = userRankingsSnapshot.val()[user.userId];

              return {
                ...user,
                level: userLevelData ? userLevelData.level : null,
                ranking: userRankingsData ? userRankingsData.ranking : null,
                difficulty: userRankingsData ? userRankingsData.dificuldade : null,
                name: userRankingsData ? userRankingsData.nome : null,
                percentage: userRankingsData ? userRankingsData.porcentagem : null,
              };
            });

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
      <h2>Todos os usuarios</h2>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Level</th>
            <th>Ranking</th>
          </tr>
        </thead>
        <tbody className='info-users-all'>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>
                <Link to={`/profile/${user.userId}`}>
                  <p style={{ color: user.nameColor }}>{user.displayName}</p>
                </Link>
              </td>
              <td>{user.level}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;