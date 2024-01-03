// useUserInteractions.js
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuthentication';
import { getDatabase, ref, get, update, set } from 'firebase/database';

const useInteractions = (gameId) => {
    const { currentUser } = useAuth();
    const [userClassification, setUserClassification] = useState(0);
    const [userGameStatus, setUserGameStatus] = useState('none');
    const [isFavorite, setIsFavorite] = useState(false);
    const [pendingChanges, setPendingChanges] = useState(false);
    const [numUsersInteracted, setNumUsersInteracted] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

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
                        setNumUsersInteracted(Object.keys(data.classifications || {}).length);
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

                // Save user interactions (classification, game status, favorite)
                await update(gameRef, {
                    classifications: {
                        [currentUser.uid]: userClassification,
                    },
                    userStatus: {
                        [currentUser.uid]: userGameStatus,
                    },
                    favorites: {
                        [currentUser.uid]: isFavorite,
                    },
                });

                // Save classification to the user-specific node
                const userClassificationRef = ref(db, `users/${currentUser.uid}/classifications/${gameId}`);
                set(userClassificationRef, userClassification);

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
        numUsersInteracted,
        isLoading,
        handleClassificationChange,
        handleStatusChange,
        handleToggleFavorite,
        handleSaveChanges,
    };
};

export default useInteractions;
