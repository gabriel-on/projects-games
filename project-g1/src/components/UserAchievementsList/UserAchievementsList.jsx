import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';  // Adicione esta linha

const UserAchievementsList = ({ userId }) => {
    const [userAchievements, setUserAchievements] = useState([]);
    const [highlightedAchievement, setHighlightedAchievement] = useState(null);

    const auth = getAuth();  // Adicione esta linha para obter o objeto auth

    const highlightAchievement = async (achievementId) => {
        try {
            // Verifica a autenticação do usuário
            if (!auth.currentUser) {
                console.log('Usuário não autenticado.');
                return;
            }

            const db = getDatabase();
            const highlightedAchievementsRef = ref(db, `highlightedAchievements/${userId}`);

            // Obtenha a conquista pelo ID
            const highlightedAchievementData = userAchievements.find(achievement => achievement.id === achievementId);

            if (!highlightedAchievementData) {
                console.log('Conquista não encontrada.');
                return;
            }

            // Use push para gerar um ID exclusivo para a conquista destacada
            const newHighlightedAchievementRef = push(highlightedAchievementsRef);

            // Salve a conquista destacada no novo nó no Firebase com o ID gerado
            await set(newHighlightedAchievementRef, highlightedAchievementData);

            // Atualize o estado com a conquista destacada
            setHighlightedAchievement(highlightedAchievementData);
        } catch (error) {
            console.error('Erro ao destacar conquista:', error.message);
        }
    };

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
                console.error('Erro ao buscar conquistas do usuário:', error.message);
            }
        };

        if (userId) {
            fetchUserAchievements();
        }
    }, [userId]);

    return (
        <div>
            {userAchievements.length > 0 ? (
                <ul>
                    {userAchievements.map((achievement) => (
                        <li key={achievement.id}>
                            <p>Conquista: {achievement.name}</p>
                            <p>Descrição: {achievement.description}</p>
                            <button onClick={() => highlightAchievement(achievement.id)}>
                                Destacar Conquista
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma conquista resgatada ainda.</p>
            )}

            {highlightedAchievement && (
                <div>
                    <p>Conquista Destacada:</p>
                    <p>Conquista: {highlightedAchievement.name}</p>
                    <p>Descrição: {highlightedAchievement.description}</p>
                </div>
            )}
        </div>
    );
};

export default UserAchievementsList;
