import React, { useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase } from 'firebase/database';
import '../FollowGame/FollowGame.css';

const FollowGame = ({ gameId }) => {
  const [isMarked, setIsMarked] = useState(false);
  const { currentUser } = useAuth();

  const handleFollowGame = async () => {
    if (currentUser) {
      const userMarksRef = ref(getDatabase(), `userMarks/${currentUser?.uid}/${gameId}`);
      if (isMarked) {
        // Se o jogo estiver marcado, desmarque-o
        await set(userMarksRef, null);
      } else {
        // Se o jogo não estiver marcado, marque-o
        await set(userMarksRef, true);
      }
      // Atualize o estado local
      setIsMarked(!isMarked);
    } else {
      // Exiba o modal de login se o usuário não estiver autenticado
      // Aqui você pode optar por lidar com isso de uma maneira específica, como emitir um aviso
      console.log('Usuário não autenticado. Exibindo modal de login.');
    }
  };

  useEffect(() => {
    const checkMarkedStatus = async () => {
      if (currentUser) {
        const userMarksRef = ref(getDatabase(), `userMarks/${currentUser?.uid}/${gameId}`);
        const userMarksSnapshot = await get(userMarksRef);
        setIsMarked(userMarksSnapshot.exists());
      }
    };

    checkMarkedStatus();
  }, [currentUser, gameId]);

  return (
    <div className='follow-game-container'>
      <button className={isMarked ? 'followed' : ''} onClick={handleFollowGame}>
        {isMarked ? 'Deixar de Seguir' : 'Seguir Jogo'}
      </button>
    </div>
  );
};

export default FollowGame;
