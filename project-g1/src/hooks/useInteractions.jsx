// useInteractions.js
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuthentication';
import { getDatabase, ref, get, update, set } from 'firebase/database';

const useInteractions = (gameId) => {
    const { currentUser } = useAuth();
    const [userClassification, setUserClassification] = useState(0);
    const [userGameStatus, setUserGameStatus] = useState('none');
    const [isFavorite, setIsFavorite] = useState(false);
    const [pendingChanges, setPendingChanges] = useState(false);
    const [userInteractions, setUserInteractions] = useState([]);
    const [allClassifications, setAllClassifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [averageClassification, setAverageClassification] = useState(0);
    const [totalInteractions, setTotalInteractions] = useState(0); // Nova variável

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

                        // Load user-specific interactions
                        const userInteractionsRef = ref(db, `games/${gameId}/userInteractions/${currentUser.uid}`);
                        const userInteractionsSnapshot = await get(userInteractionsRef);

                        if (userInteractionsSnapshot.exists()) {
                            const interactions = userInteractionsSnapshot.val();
                            setUserInteractions(Object.values(interactions));

                            // Calcular a média das classificações dos usuários específicos
                            const totalClassifications = Object.values(interactions)
                                .reduce((sum, interaction) => sum + parseInt(interaction.classification), 0);
                            const average = totalClassifications / Object.keys(interactions).length;
                            setAverageClassification(average);
                        }

                        // Load all classifications from users
                        const allClassificationsRef = ref(db, `games/${gameId}/classifications`);
                        const allClassificationsSnapshot = await get(allClassificationsRef);

                        if (allClassificationsSnapshot.exists()) {
                            const classificationsData = allClassificationsSnapshot.val();
                            const allClassificationsArray = Object.values(classificationsData)
                                .map(userClassifications => Object.values(userClassifications))
                                .flat();
                            setAllClassifications(allClassificationsArray);

                            // Calcular a média de todas as classificações dos usuários
                            const totalAllClassifications = allClassificationsArray
                                .reduce((sum, classification) => sum + parseInt(classification), 0);
                            const averageAll = totalAllClassifications / allClassificationsArray.length;
                            setAverageClassification(averageAll);

                            // Contar total de interações
                            const totalInteractionsCount = Object.keys(data.classifications || {}).length =
                                Object.keys(data.favorites || {}).length =
                                Object.keys(data.userStatus || {}).length;
                            setTotalInteractions(totalInteractionsCount);
                        }

                        // Load user-specific game status
                        const userGameStatusRef = ref(db, `games/${gameId}/userStatus/${currentUser.uid}`);
                        const userGameStatusSnapshot = await get(userGameStatusRef);

                        if (userGameStatusSnapshot.exists()) {
                            setUserGameStatus(userGameStatusSnapshot.val());
                        } else {
                            // Se não houver status específico do usuário, use 'none' como padrão
                            setUserGameStatus('none');
                        }

                        setIsFavorite(data.favorites?.[currentUser.uid] || false);
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

                // Atualizar classificação do usuário
                await update(gameRef, {
                    [`classifications/${currentUser.uid}`]: userClassification,
                });

                // Salvar status do jogo específico do usuário
                const userGameStatusRef = ref(db, `games/${gameId}/userStatus/${currentUser.uid}`);
                await set(userGameStatusRef, userGameStatus);

                // Salvar favoritos específicos do usuário
                const favoritesRef = ref(db, `games/${gameId}/favorites/${currentUser.uid}`);
                await set(favoritesRef, isFavorite);

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
        allClassifications,
        isLoading,
        handleClassificationChange,
        handleStatusChange,
        handleToggleFavorite,
        handleSaveChanges,
        averageClassification,
        totalInteractions, // Adicionado para contar o número total de interações
    };
};

export default useInteractions;
