import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';

const FirstVisitAchievement = ({ userId, firstVisitAchievementId }) => {
    const [achievementData, setAchievementData] = useState(null);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        const claimAchievement = async () => {
            try {
                const db = getDatabase();

                if (userId) {
                    const userAchievementRef = ref(db, `userAchievements/${userId}/${firstVisitAchievementId}`);
                    const userAchievementSnapshot = await get(userAchievementRef);

                    if (!userAchievementSnapshot.exists()) {
                        const achievementRef = ref(db, `achievements/${firstVisitAchievementId}`);
                        const achievementSnapshot = await get(achievementRef);
                        const achievementInfo = achievementSnapshot.val();

                        if (achievementInfo) {
                            await set(userAchievementRef, {
                                name: achievementInfo.name,
                                description: achievementInfo.description,
                                points: achievementInfo.points,
                            });

                            setAchievementData(achievementInfo);
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao reivindicar conquista:', error);
            }
        };

        if (userId && firstVisitAchievementId && !isClosed) {
            claimAchievement();
        }
    }, [userId, firstVisitAchievementId, isClosed]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsClosed(true);
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, []);

    if (isClosed || !achievementData) {
        return null;
    }

    return (
        <div>
            <h2>Conquista Desbloqueada!</h2>
            <div>
                <p>Você desbloqueou a conquista "{achievementData.name}" ao acessar o site pela primeira vez.</p>
                <p>Descrição: {achievementData.description}</p>
                <p>Pontos: {achievementData.points}</p>
                <button onClick={() => setIsClosed(true)}>Fechar</button>
            </div>
        </div>
    );
};

export default FirstVisitAchievement;
