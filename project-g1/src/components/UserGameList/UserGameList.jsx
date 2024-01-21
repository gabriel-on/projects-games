import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const UserGameList = ({ userId }) => {
  const [userGameFollowers, setUserGameFollowers] = useState([]);
  const [gamesDetails, setGamesDetails] = useState([]);

  useEffect(() => {
    const fetchUserGameFollowers = async () => {
      const db = getDatabase();
      const userGameFollowersRef = ref(db, 'gameFollowers');

      try {
        console.log('Fetching user game followers for userId:', userId);
        const snapshot = await get(userGameFollowersRef);
        console.log('Snapshot:', snapshot.val());

        if (snapshot.exists()) {
          const gameFollowersData = snapshot.val();
          const userGameFollowersList = Object.keys(gameFollowersData).filter(key => {
            // Filter only the IDs related to the current user
            return gameFollowersData[key][userId] === true;
          });
          console.log('User game followers:', userGameFollowersList);
          setUserGameFollowers(userGameFollowersList);

          // Fetch details for each game
          const gamesDetailsPromises = userGameFollowersList.map(async gameId => {
            const gameRef = ref(db, `games/${gameId}`);
            const gameSnapshot = await get(gameRef);
            return gameSnapshot.val();
          });

          const gamesDetails = await Promise.all(gamesDetailsPromises);
          console.log('Games details:', gamesDetails);
          setGamesDetails(gamesDetails);
        } else {
          console.log('No data found for user game followers.');
          setUserGameFollowers([]);
        }
      } catch (error) {
        console.error('Error fetching user game followers:', error);
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
                <strong>{game.title}</strong>
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
