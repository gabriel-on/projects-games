import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update, onValue, get } from 'firebase/database';

const UserFollowButton = ({ currentUserUid, targetUserId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkIfFollowing();
        loadFollowerCount();
    }, [targetUserId]); // Adicionando targetUserId como dependência

    const checkIfFollowing = async () => {
        try {
            const db = getDatabase();
            const currentUserFollowingRef = ref(db, `users/${currentUserUid}/following`);

            const snapshot = await get(currentUserFollowingRef);
            const followingList = snapshot.val() || {};

            setIsFollowing(targetUserId in followingList);
        } catch (error) {
            console.error('Erro ao verificar se está seguindo:', error.message);
            setError('Erro ao verificar se está seguindo');
        }
    };

    const loadFollowerCount = () => {
        try {
            const db = getDatabase();
            const targetUserFollowersRef = ref(db, `users/${targetUserId}/followers`);
            onValue(targetUserFollowersRef, (snapshot) => {
                const followers = snapshot.val() || {};
                const count = Object.keys(followers).length;
                setFollowerCount(count);
            });
        } catch (error) {
            console.error('Erro ao carregar contagem de seguidores:', error.message);
            setError('Erro ao carregar contagem de seguidores');
        }
    };

    const toggleFollow = async () => {
        try {
            setLoading(true);
            const db = getDatabase();
            const currentUserFollowingRef = ref(db, `users/${currentUserUid}/following`);
            const targetUserFollowersRef = ref(db, `users/${targetUserId}/followers`);

            if (isFollowing) {
                await update(currentUserFollowingRef, { [targetUserId]: null });
                await update(targetUserFollowersRef, { [currentUserUid]: null });
            } else {
                await update(currentUserFollowingRef, { [targetUserId]: true });
                await update(targetUserFollowersRef, { [currentUserUid]: true });
            }

            setIsFollowing(!isFollowing);
            loadFollowerCount();
        } catch (error) {
            console.error('Erro ao seguir/deixar de seguir usuário:', error.message);
            setError('Erro ao seguir/deixar de seguir usuário');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                className={isFollowing ? 'followed' : ''}
                onClick={toggleFollow}
                disabled={loading || currentUserUid === targetUserId}
            >
                {loading ? 'Aguarde...' : isFollowing ? 'Deixar de Seguir' : 'Seguir'}
            </button>
            <span>{followerCount} Seguidores</span>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UserFollowButton;