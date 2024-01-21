// FollowersCount.jsx
import React, { useState, useEffect } from 'react';
import { ref, getDatabase, onValue, off } from 'firebase/database';

const FollowersCount = ({ gameId }) => {
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const gameFollowersRef = ref(getDatabase(), `gameFollowers/${gameId}`);

    const updateFollowersCount = (snapshot) => {
      console.log('Snapshot:', snapshot.val());

      if (snapshot.exists()) {
        const followersData = snapshot.val();
        console.log('Followers Data:', followersData);

        // Usando Object.values diretamente no objeto do snapshot
        const numberOfFollowers = Object.keys(followersData).length;

        console.log('Número de seguidores:', numberOfFollowers);
        setFollowersCount(numberOfFollowers);
      } else {
        console.log('Snapshot não existe ou está vazio. Definindo o número de seguidores como 0.');
        setFollowersCount(0);
      }
    };

    // Use onValue para ouvir alterações nos dados
    onValue(gameFollowersRef, updateFollowersCount);

    // Retorne uma função de limpeza para desinscrever o ouvinte quando o componente for desmontado
    return () => {
      off(gameFollowersRef, 'value', updateFollowersCount);
    };
  }, [gameId]);

  return (
    <p>{followersCount} usuário(s) seguindo este jogo</p>
  );
};

export default FollowersCount;