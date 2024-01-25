import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GameStatusModal from '../GamesStatus/GameStatusModal';
import FollowGame from '../FollowGame/FollowGame';

function FavoriteGamesList({
  favoriteGames,
  userClassification,
  handleClassificationChange,
  handleStatusChange,
  handleToggleFavorite,
  handleSaveChanges,
}) {
  const [showGameStatusModal, setShowGameStatusModal] = useState(false);

  return (
    <div className='favorites-container'>
      {favoriteGames.length > 0 && (
        <div className='favorites-container'>
          <ul>
            {favoriteGames.map((game) => (
              <li key={game.id}>
                <Link to={`/game/${game.id}`}>
                  <p>{game.title}</p>
                  <img src={game.image} alt="" />
                </Link>
                <div>
                  <button onClick={() => setShowGameStatusModal(true)}>
                    <i className="bi bi-bookmarks-fill"></i>
                  </button>
                  <>
                    <FollowGame gameId={game.id} />
                  </>
                </div>
                {showGameStatusModal && (
                  <GameStatusModal
                    gameId={game.id}
                    userClassification={userClassification}
                    onClassificationChange={handleClassificationChange}
                    onStatusChange={handleStatusChange}
                    onToggleFavorite={handleToggleFavorite}
                    onSaveChanges={handleSaveChanges}
                    onClose={() => setShowGameStatusModal(false)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FavoriteGamesList;
