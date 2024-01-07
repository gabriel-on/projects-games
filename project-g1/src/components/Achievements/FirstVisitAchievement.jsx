import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';

const FirstVisitAchievement = ({ userId, firstVisitAchievementId }) => {
    const [isAchievementClaimed, setIsAchievementClaimed] = useState(false);
    const [achievementData, setAchievementData] = useState(null);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        const claimAchievement = async () => {
            try {
                const db = getDatabase();

                if (userId) {
                    const userAchievementRef = ref(db, `userAchievements/${userId}/${firstVisitAchievementId}`);
                    const userAchievementSnapshot = await get(userAchievementRef);

                    if (!userAchievementSnapshot.exists() || !userAchievementSnapshot.val().claimed) {
                        const achievementRef = ref(db, `achievements/${firstVisitAchievementId}`);
                        const achievementSnapshot = await get(achievementRef);
                        const achievementInfo = achievementSnapshot.val();

                        if (achievementInfo) {
                            await set(userAchievementRef, {
                                claimed: true,
                                name: achievementInfo.name,
                                description: achievementInfo.description,
                                points: achievementInfo.points,
                            });

                            setIsAchievementClaimed(true);
                            setAchievementData(achievementInfo);
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao reivindicar conquista:', error);
            }
        };

        if (userId && firstVisitAchievementId && !isAchievementClaimed) {
            claimAchievement();
        }
    }, [userId, firstVisitAchievementId, isAchievementClaimed]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsClosed(true);
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
    }, [isAchievementClaimed, achievementData]);

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
                {isAchievementClaimed && (
                    <p>Conquista já resgatada automaticamente!</p>
                )}
            </div>
        </div>
    );
};

export default FirstVisitAchievement;
