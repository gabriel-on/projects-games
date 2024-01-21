// FollowGame.jsx
import React, { useState, useEffect } from 'react';
import { ref, set, get, getDatabase, remove } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import '../FollowGame/FollowGame.css';
import FollowersCount from './FollowersCount.jsx';

const FollowGame = ({ gameId }) => {
  const [isMarked, setIsMarked] = useState(false);
  const { currentUser } = useAuth();

  const followGame = async () => {
    if (currentUser) {
      const gameFollowersRef = ref(getDatabase(), `gameFollowers/${gameId}/${currentUser.uid}`);
      await set(gameFollowersRef, true);
      setIsMarked(true);
    }
  };

  const unfollowGame = async () => {
    if (currentUser) {
      const gameFollowersRef = ref(getDatabase(), `gameFollowers/${gameId}/${currentUser.uid}`);
      await remove(gameFollowersRef);
      setIsMarked(false);
    }
  };

  useEffect(() => {
    const checkMarkedStatus = async () => {
      if (currentUser) {
        const gameFollowersRef = ref(getDatabase(), `gameFollowers/${gameId}/${currentUser.uid}`);
        const gameFollowersSnapshot = await get(gameFollowersRef);
        setIsMarked(gameFollowersSnapshot.exists());
      }
    };

    checkMarkedStatus();
  }, [currentUser, gameId]);

  return (
    <div className='follow-game-container'>
      <button className={isMarked ? 'followed' : ''} onClick={isMarked ? unfollowGame : followGame}>
        {isMarked ? 'Deixar de Seguir' : 'Seguir Jogo'}
      </button>
      <FollowersCount gameId={gameId} />
    </div>
  );
};

export default FollowGame;
