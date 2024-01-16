import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const UserAchievementsList = ({ userId }) => {
    const [userAchievements, setUserAchievements] = useState([]);

    useEffect(() => {
        const fetchUserAchievements = async () => {
            try {
                const db = getDatabase();
                const userAchievementsRef = ref(db, `userAchievements/${userId}`);
                
                // Use onValue para ouvir alterações no banco de dados
                onValue(userAchievementsRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        
                        // Filtra as conquistas que têm as informações necessárias
                        const filteredAchievements = Object.keys(data)
                            .filter((achievementId) => {
                                const achievement = data[achievementId];
                                return (
                                    achievement.name &&
                                    achievement.description &&
                                    achievement.points !== undefined
                                );
                            })
                            .map((achievementId) => ({
                                id: achievementId,
                                ...data[achievementId],
                            }));
                        
                        // Atualiza o estado com as conquistas filtradas
                        setUserAchievements(filteredAchievements);
                    } else {
                        setUserAchievements([]);
                    }
                });
            } catch (error) {
                console.error('Erro ao buscar conquistas do usuário:', error);
            }
        };

        if (userId) {
            fetchUserAchievements();
        }
    }, [userId]);

    return (
        <div>
            <h2>Conquistas Resgatadas</h2>
            {userAchievements.length > 0 ? (
                <ul>
                    {userAchievements.map((achievement) => (
                        <li key={achievement.id}>
                            <p>Conquista: {achievement.name}</p>
                            <p>Descrição: {achievement.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma conquista resgatada ainda.</p>
            )}
        </div>
    );
};

export default UserAchievementsList;
