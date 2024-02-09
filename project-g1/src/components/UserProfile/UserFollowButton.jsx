import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update, onValue } from 'firebase/database';

const UserFollowButton = ({ currentUserUid, targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    // Verificar se o usuário atual está seguindo o usuário-alvo ao montar o componente
    checkIfFollowing();
    // Carregar a contagem de seguidores
    loadFollowerCount();
  }, []);

  const checkIfFollowing = async () => {
    try {
      const db = getDatabase();
      const currentUserFollowingRef = ref(db, `users/${currentUserUid}/following`);

      const snapshot = await currentUserFollowingRef.once('value');
      const followingList = snapshot.val() || {};

      setIsFollowing(targetUserId in followingList);
    } catch (error) {
      console.error('Erro ao verificar se está seguindo:', error.message);
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
    }
  };

  const toggleFollow = async () => {
    try {
      const db = getDatabase();

      // Adicionar ou remover o usuário atual dos seguidores do usuário-alvo
      const currentUserFollowingRef = ref(db, `users/${currentUserUid}/following`);
      const targetUserFollowersRef = ref(db, `users/${targetUserId}/followers`);

      if (isFollowing) {
        // Se estiver seguindo, deixe de seguir
        await update(currentUserFollowingRef, { [targetUserId]: null });
        await update(targetUserFollowersRef, { [currentUserUid]: null });
      } else {
        // Se não estiver seguindo, comece a seguir
        await update(currentUserFollowingRef, { [targetUserId]: true });
        await update(targetUserFollowersRef, { [currentUserUid]: true });
      }

      // Atualizar o estado do botão
      setIsFollowing(!isFollowing);

      // Atualizar a contagem de seguidores após a ação
      loadFollowerCount();
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir usuário:', error.message);
    }
  };

  return (
    <div>
      <button onClick={toggleFollow} disabled={currentUserUid === targetUserId}>
        {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
      </button>
      <span>{followerCount} Seguidores</span>
    </div>
  );
};

export default UserFollowButton;
