// FollowGame.jsx
import React, { useState, useEffect } from 'react';
import { ref, set, get, getDatabase, remove } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import '../FollowGame/FollowGame.css';
import FollowersCount from './FollowersCount.jsx';

const FollowGame = ({ gameId }) => {
  const [isMarked, setIsMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const followGame = async () => {
    try {
      setLoading(true);
      if (currentUser) {
        const gameFollowersRef = ref(getDatabase(), `gameFollowers/${gameId}/${currentUser.uid}`);
        await set(gameFollowersRef, true);
        setIsMarked(true);
      }
    } catch (error) {
      console.error('Error following game:', error);
    } finally {
      setLoading(false);
    }
  };

  const unfollowGame = async () => {
    try {
      setLoading(true);
      if (currentUser) {
        const gameFollowersRef = ref(getDatabase(), `gameFollowers/${gameId}/${currentUser.uid}`);
        await remove(gameFollowersRef);
        setIsMarked(false);
      }
    } catch (error) {
      console.error('Error unfollowing game:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkMarkedStatus = async () => {
      try {
        if (currentUser) {
          const gameFollowersRef = ref(getDatabase(), `gameFollowers/${gameId}/${currentUser.uid}`);
          const gameFollowersSnapshot = await get(gameFollowersRef);
          setIsMarked(gameFollowersSnapshot.exists());
        }
      } catch (error) {
        console.error('Error checking marked status:', error);
      }
    };

    checkMarkedStatus();
  }, [currentUser, gameId]);

  return (
    <div className='follow-game-container'>
      <button className={isMarked ? 'followed' : ''} onClick={isMarked ? unfollowGame : followGame} disabled={loading}>
        {loading ? 'Aguarde...' : isMarked ? 'Seguindo' : 'Seguir Jogo'}
      </button>
      <FollowersCount gameId={gameId} />
    </div>
  );
};

export default FollowGame;