import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import GamesStatus from '../GamesStatus/GamesStatus.jsx';
import FollowGame from '../FollowGame/FollowGame.jsx';
import { Link } from 'react-router-dom'

const UserGameList = ({ userId }) => {
  const [userGameFollowers, setUserGameFollowers] = useState([]);
  const [gamesDetails, setGamesDetails] = useState([]);

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

  return (
    <div>
      <h2>User's Game Followers:</h2>
      <ul>
        {gamesDetails.map((game, index) => (
          <li key={index}>
            {game ? (
              <>
                <Link to={`/game/${game.id}`}>
                  <strong>{game.details.title}</strong>
                </Link>
                <GamesStatus gameId={game.id}/>
                <FollowGame gameId={game.id} />
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
