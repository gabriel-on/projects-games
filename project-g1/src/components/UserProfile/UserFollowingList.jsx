import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const UserFollowingList = ({ userId }) => {
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDataList, setUserDataList] = useState([]);

  useEffect(() => {
    // Carregar a lista de usuários seguidos ao montar o componente
    loadFollowingList();
  }, []);

  const loadFollowingList = async () => {
    try {
      const db = getDatabase();
      const currentUserFollowingRef = ref(db, `users/${userId}/following`);
      
      // Obter dados dos usuários seguidos em uma única chamada
      const snapshot = await get(currentUserFollowingRef);
      const followingData = snapshot.val() || {};
      const followingIds = Object.keys(followingData);

      // Obter detalhes dos usuários seguidos em uma única chamada
      const userDetailsPromises = followingIds.map(async (userId) => {
        const userRef = ref(db, `users/${userId}`);
        const userSnapshot = await get(userRef);
        return { userId, userData: userSnapshot.val() };
      });

      const userDetails = await Promise.all(userDetailsPromises);
      setUserDataList(userDetails);
      setFollowingList(followingIds);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar lista de usuários seguidos:', error.message);
      setError('Erro ao carregar lista de usuários seguidos');
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {userDataList.map(({ userId, userData }) => (
            <li key={userId}>
              {userData ? (
                <strong>{userData.displayName}</strong>
              ) : (
                'Usuário não encontrado'
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFollowingList;
