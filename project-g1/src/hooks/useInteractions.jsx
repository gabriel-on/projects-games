import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuthentication';
import { getDatabase, ref, get, update, set, push } from 'firebase/database';

const useInteractions = (gameId) => {
    const { currentUser } = useAuth();
    const [userClassification, setUserClassification] = useState(0);
    const [userGameStatus, setUserGameStatus] = useState('none');
    const [isFavorite, setIsFavorite] = useState(false);
    const [pendingChanges, setPendingChanges] = useState(false);
    const [userInteractions, setUserInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [averageClassification, setAverageClassification] = useState(0);

    useEffect(() => {
        if (currentUser) {
            const loadUserInteractions = async () => {
                try {
                    const db = getDatabase();
                    const gameRef = ref(db, `games/${gameId}`);

                    // Load user interactions (classification, game status, favorite)
                    const snapshot = await get(gameRef);

                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setUserClassification(data.classifications?.[currentUser.uid] || 0);
                        setUserGameStatus(data.userStatus?.[currentUser.uid] || 'none');
                        setIsFavorite(data.favorites?.[currentUser.uid] || false);
                        
                        // Load user-specific interactions
                        const userInteractionsRef = ref(db, `games/${gameId}/userInteractions/${currentUser.uid}`);
                        const userInteractionsSnapshot = await get(userInteractionsRef);

                        if (userInteractionsSnapshot.exists()) {
                            const interactions = userInteractionsSnapshot.val();
                            setUserInteractions(Object.values(interactions));

                            // Calcular a média das classificações dos usuários
                            const totalClassifications = Object.values(interactions)
                                .reduce((sum, interaction) => sum + parseInt(interaction.classification), 0);
                            const average = totalClassifications / Object.keys(interactions).length;
                            setAverageClassification(average);
                        }
                    }

                } catch (error) {
                    console.error('Error loading user interactions:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            loadUserInteractions();
        }
    }, [currentUser, gameId]);

    const handleClassificationChange = (newClassification) => {
        setUserClassification(newClassification);
        setPendingChanges(true);
    };

    const handleStatusChange = (newStatus) => {
        setUserGameStatus(newStatus);
        setPendingChanges(true);
    };

    const handleToggleFavorite = () => {
        setIsFavorite((prevIsFavorite) => !prevIsFavorite);
        setPendingChanges(true);
    };

    const handleSaveChanges = async () => {
        if (pendingChanges) {
            if (!currentUser) {
                console.error('User not logged in. Cannot save interactions.');
                return;
            }

            try {
                const db = getDatabase();
                const gameRef = ref(db, `games/${gameId}`);

                // Atualizar classificação e status do usuário
                await update(gameRef, {
                    [`classifications/${currentUser.uid}`]: userClassification,
                    userStatus: {
                        [currentUser.uid]: userGameStatus,
                    },
                });

                // Salvar favoritos específicos do usuário
                const favoritesRef = ref(db, `games/${gameId}/favorites/${currentUser.uid}`);
                await set(favoritesRef, isFavorite);

                // Salvar interação específica do usuário
                const userInteractionsRef = ref(db, `games/${gameId}/userInteractions/${currentUser.uid}`);
                const newInteractionRef = push(userInteractionsRef);
                await set(newInteractionRef, {
                    classification: userClassification,
                    timestamp: new Date().toISOString(),
                });

                setPendingChanges(false);
                console.log('User interactions saved successfully!');
            } catch (error) {
                console.error('Error saving user interactions:', error);
            }
        }
    };

    return {
        userClassification,
        userGameStatus,
        isFavorite,
        pendingChanges,
        userInteractions,
        isLoading,
        handleClassificationChange,
        handleStatusChange,
        handleToggleFavorite,
        handleSaveChanges,
        averageClassification,
    };
};

export default useInteractions;
