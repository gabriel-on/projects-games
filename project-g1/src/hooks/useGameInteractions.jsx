// useTotalInteractions.js
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuthentication';
import { getDatabase, ref, get } from 'firebase/database';

const useGameInteractions = () => {
    const { currentUser } = useAuth();
    const [totalInteractions, setTotalInteractions] = useState(0);
    const [gamesWithInteractions, setGamesWithInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const loadTotalInteractions = async () => {
                try {
                    const db = getDatabase();
                    const gamesRef = ref(db, 'games');

                    const snapshot = await get(gamesRef);

                    if (snapshot.exists()) {
                        const gamesData = snapshot.val();
                        const allGameIds = Object.keys(gamesData);

                        // Mapear e contar as interações para cada jogo
                        const gamesWithInteractionsCount = await Promise.all(allGameIds.map(async (gameId) => {
                            const gameRef = ref(db, `games/${gameId}`);
                            const gameSnapshot = await get(gameRef);

                            if (gameSnapshot.exists()) {
                                const data = gameSnapshot.val();
                                const interactionsCount =
                                    Object.keys(data.classifications || {}).length =
                                    Object.keys(data.favorites || {}).length =
                                    Object.keys(data.userStatus || {}).length;

                                return { gameId, interactionsCount, gameData: data };
                            }

                            return { gameId, interactionsCount: 0, gameData: null };
                        }));

                        // Ordenar a lista de jogos com base nas interações
                        const sortedGames = gamesWithInteractionsCount.sort((a, b) => b.interactionsCount - a.interactionsCount);

                        setGamesWithInteractions(sortedGames);

                        // Calcular o número total de interações
                        const total = sortedGames.reduce((acc, game) => acc + game.interactionsCount, 0);
                        setTotalInteractions(total);
                    }
                } catch (error) {
                    console.error('Error loading total interactions:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            loadTotalInteractions();
        }
    }, [currentUser]);

    return {
        totalInteractions,
        gamesWithInteractions,
        isLoading,
    };
};

export default useGameInteractions;