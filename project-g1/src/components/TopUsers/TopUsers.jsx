// TopUsers.js
import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import '../TopUsers/TopUsers.css';

const TopUsers = () => {
    const [topUsers, setTopUsers] = useState([]);
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

                    // Fetch data from userRankings
                    const userRankingsRef = ref(database, 'userRankings');
                    const userRankingsSnapshot = await get(userRankingsRef);

                    if (usersLevelSnapshot.exists() && userRankingsSnapshot.exists()) {
                        const mergedData = usersData.map(topUser => {
                            const userLevelData = usersLevelSnapshot.val()[topUser.userId];
                            const userRankingsData = userRankingsSnapshot.val()[topUser.userId];

                            return {
                                ...topUser,
                                level: userLevelData ? userLevelData.level : null,
                                ranking: userRankingsData ? userRankingsData.ranking : null,
                                difficulty: userRankingsData ? userRankingsData.dificuldade : null,
                                name: userRankingsData ? userRankingsData.nome : null,
                                percentage: userRankingsData ? userRankingsData.porcentagem : null,
                            };
                        });

                        // Sort users by level in descending order
                        mergedData.sort((a, b) => (b.level || 0) - (a.level || 0));

                        // Limit the results to the top 10 users
                        const top10Users = mergedData.slice(0, 10);

                        setTopUsers(top10Users);
                    }
                }
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };

        fetchData();
    }, [database]);

    return (
        <div className='info-top-users-container'>
            <h2>Top 10 Usuários</h2>
            <table>
                <tbody className='info-top-users'>
                    {topUsers.map((user, index) => (
                        <tr key={user.userId} className={index < 3 ? `highlight-top-${index + 1}` : ''}>
                            <td>
                                <img src={``} alt="Foto de perfil" />
                            </td>
                            <td>
                                <Link to={`/profile/${user.userId}`} className='name-top'>
                                    Nome: {user.displayName}
                                </Link>
                                <p className='position-top'>{index + 1} &deg;</p>
                            </td>
                            <td>
                                <p className='level-top'>Nível: {user.level}</p>
                                <p>Rank: {user.name}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopUsers;