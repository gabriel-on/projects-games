import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import FollowGame from '../FollowGame/FollowGame.jsx';
import { Link } from 'react-router-dom';
import GameStatusModal from '../GamesStatus/GameStatusModal.jsx';

import '../UserGameList/UserGameList.css';

const UserGameList = ({ userId, userClassification, handleClassificationChange, handleStatusChange, handleToggleFavorite, handleSaveChanges }) => {
  const [userGameFollowers, setUserGameFollowers] = useState([]);
  const [gamesDetails, setGamesDetails] = useState([]);
  const [showGameStatusModal, setShowGameStatusModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    const fetchUserGameFollowers = async () => {
      const db = getDatabase();
      const userGameFollowersRef = ref(db, 'gameFollowers');

      try {
        const snapshot = await get(userGameFollowersRef);

        if (snapshot.exists()) {
          const gameFollowersData = snapshot.val();
          const userGameFollowersList = Object.keys(gameFollowersData).filter(key => {
            // Filter only the IDs related to the current user
            return gameFollowersData[key][userId] === true;
          });
          setUserGameFollowers(userGameFollowersList);

          // Fetch details for each game
          const gamesDetailsPromises = userGameFollowersList.map(async gameId => {
            const gameRef = ref(db, `games/${gameId}`);
            const gameSnapshot = await get(gameRef);
            return {
              id: gameId,
              details: gameSnapshot.val(),
            };
          });

          const gamesDetails = await Promise.all(gamesDetailsPromises);
          setGamesDetails(gamesDetails);
        } else {
          console.log('No data found for user game followers.');
          setUserGameFollowers([]);
        }
      } catch (error) {
        setUserGameFollowers([]);
      }
    };

    fetchUserGameFollowers();
  }, [userId]);

  const openGameStatusModal = (gameId) => {
    setShowGameStatusModal(true);
    setSelectedGameId(gameId);
  };

  const closeGameStatusModal = () => {
    setShowGameStatusModal(false);
    setSelectedGameId(null);
  };

  return (
    <div className='game-followers-container'>
      <ul>
        {gamesDetails.map((game, index) => (
          <li key={index}>
            <Link to={`/game/${game.id}`}>
              <strong>{game.details.title}</strong>
              <img src={game.details.image} alt="" className='game-followers-img' />
            </Link>
            {game && game.details ? (
              <>
                <div>
                  <button onClick={() => openGameStatusModal(game.id)}>
                    <i className="bi bi-bookmarks-fill"></i>
                  </button>
                  <>
                    <FollowGame gameId={game.id} />
                  </>
                </div>
                {showGameStatusModal && selectedGameId === game.id && (
                  <GameStatusModal
                    gameId={game.id}
                    userClassification={userClassification}
                    onClassificationChange={handleClassificationChange}
                    onStatusChange={handleStatusChange}
                    onToggleFavorite={handleToggleFavorite}
                    onSaveChanges={handleSaveChanges}
                    onClose={closeGameStatusModal}
                  />
                )}
              </>
            ) : (
              <span>Game not found</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserGameList;