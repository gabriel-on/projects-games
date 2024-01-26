import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, set, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const UserAchievementsList = ({ userId }) => {
    const [userAchievements, setUserAchievements] = useState([]);
    const [highlightedAchievement, setHighlightedAchievement] = useState(null);
    const [highlightedAchievementsMap, setHighlightedAchievementsMap] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    const saveHighlightToDatabase = async (achievementId) => {
        try {
            const db = getDatabase();
            const userHighlightedAchievementsRef = ref(db, `userHighlightedAchievements/${userId}/${achievementId}`);

            await set(userHighlightedAchievementsRef, true);

            console.log('Conquista destacada com sucesso!');
        } catch (error) {
            console.error('Erro ao destacar conquista:', error.message);
        }
    };

    const fetchHighlightedAchievementsFromDatabase = async () => {
        try {
            const db = getDatabase();
            const userHighlightedAchievementsRef = ref(db, `userHighlightedAchievements/${userId}`);

            const snapshot = await get(userHighlightedAchievementsRef);
            const data = snapshot.val() || {};
            setHighlightedAchievementsMap(data);
        } catch (error) {
            console.error('Erro ao obter conquistas destacadas do usuário:', error.message);
        }
    };

    const highlightAchievement = async (achievementId) => {
        try {
            if (!currentUser) {
                console.log('Usuário não autenticado.');
                return;
            }

            if (highlightedAchievementsMap[achievementId]) {
                console.log('Conquista já destacada anteriormente.');
                return;
            }

            const db = getDatabase();
            const highlightedAchievementsRef = ref(db, `highlightedAchievements/${userId}`);

            const highlightedAchievementData = userAchievements.find(achievement => achievement.id === achievementId);

            if (!highlightedAchievementData) {
                console.log('Conquista não encontrada.');
                return;
            }

            const newHighlightedAchievementRef = push(highlightedAchievementsRef);
            await set(newHighlightedAchievementRef, highlightedAchievementData);

            setHighlightedAchievement(highlightedAchievementData);

            setHighlightedAchievementsMap(prevMap => ({
                ...prevMap,
                [achievementId]: true,
            }));

            await saveHighlightToDatabase(achievementId);
            console.log('Conquista destacada com sucesso!');
        } catch (error) {
            console.error('Erro ao destacar conquista:', error.message);
        }
    };

    useEffect(() => {
        const fetchUserAchievements = async () => {
            try {
                const db = getDatabase();
                const userAchievementsRef = ref(db, `userAchievements/${userId}`);

                onValue(userAchievementsRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();

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

                        setUserAchievements(filteredAchievements);

                        // Após carregar as conquistas do usuário, busque as destacadas no banco de dados
                        fetchHighlightedAchievementsFromDatabase();
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
                            {currentUser && currentUser.uid === userId && (
                                <button
                                    onClick={() => highlightAchievement(achievement.id)}
                                    disabled={highlightedAchievementsMap[achievement.id]}
                                >
                                    Destacar Conquista
                                </button>
                            )}
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
