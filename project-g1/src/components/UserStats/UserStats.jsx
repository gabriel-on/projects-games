import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import './UserStats.css'; // Importa o arquivo CSS

const UserStats = ({ userId }) => {
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    gamesPlayed: 0,
    gamesInProgress: 0,
    favoriteGames: 0,
    planning: 0,
    rePlaying: 0,
    pause: 0,
    quit: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase();
      const userGamesRef = ref(database, `games`);
      const userGamesSnapshot = await get(userGamesRef);
      const userGamesData = userGamesSnapshot.val();

      // Filtra apenas os jogos do usuário
      const userGames = Object.keys(userGamesData).filter((gameId) => {
        return userGamesData[gameId].userStatus && userGamesData[gameId].userStatus[userId];
      });

      // Calcula estatísticas com base nos jogos do usuário
      const stats = {
        totalGames: userGames.length,
        gamesPlayed: userGames.filter((gameId) => userGamesData[gameId].userStatus[userId] === 'played').length,
        gamesInProgress: userGames.filter((gameId) => userGamesData[gameId].userStatus[userId] === 'playing').length,
        favoriteGames: userGames.filter((gameId) => userGamesData[gameId].favorites && userGamesData[gameId].favorites[userId]).length,
        planning: userGames.filter((gameId) => userGamesData[gameId].userStatus[userId] === 'planning').length,
        rePlaying: userGames.filter((gameId) => userGamesData[gameId].userStatus[userId] === 're-playing').length,
        pause: userGames.filter((gameId) => userGamesData[gameId].userStatus[userId] === 'pause').length,
        quit: userGames.filter((gameId) => userGamesData[gameId].userStatus[userId] === 'quit').length,
      };

      // Atualiza o estado com as estatísticas gerais do usuário
      setUserStats(stats);
    };

    fetchData();
  }, [userId]);

  return (
    <div className="user-stats">
      <h2>Estatísticas dos Jogos</h2>

      <div className="user-progress-bar">
        <p>Total de Jogos: {userStats.totalGames}</p>
        {/* <div className="bar" style={{ width: `${(userStats.totalGames / userStats.totalGames) * 100}%` }}>
          {userStats.totalGames > 0 && <span>{(userStats.totalGames / userStats.totalGames) * 100}%</span>}
        </div> */}
      </div>

      <div className="user-progress-bar">
        <p>Zerados: {userStats.gamesPlayed}</p>
        <div className="bar" style={{ width: `${(userStats.gamesPlayed / userStats.totalGames) * 100}%` }}>
          {userStats.gamesPlayed > 0 && <span>{(userStats.gamesPlayed / userStats.totalGames) * 100}%</span>}
        </div>
      </div>

      {/* <div className="user-progress-bar">
        <p>Favoritos: {userStats.favoriteGames}</p>
        <div className="bar" style={{ width: `${(userStats.favoriteGames / userStats.totalGames) * 100}%` }}>
          {userStats.favoriteGames > 0 && <span>{(userStats.favoriteGames / userStats.totalGames) * 100}%</span>}
        </div>
      </div> */}

      <div className="user-progress-bar">
        <p>Planejando: {userStats.planning}</p>
        <div className="bar" style={{ width: `${(userStats.planning / userStats.totalGames) * 100}%` }}>
          {userStats.planning > 0 && <span>{(userStats.planning / userStats.totalGames) * 100}%</span>}
        </div>
      </div>

      <div className="user-progress-bar">
        <p>Re-Jogando: {userStats.rePlaying}</p>
        <div className="bar" style={{ width: `${(userStats.rePlaying / userStats.totalGames) * 100}%` }}>
          {userStats.rePlaying > 0 && <span>{(userStats.rePlaying / userStats.totalGames) * 100}%</span>}
        </div>
      </div>

      <div className="user-progress-bar">
        <p>Pausado: {userStats.pause}</p>
        <div className="bar" style={{ width: `${(userStats.pause / userStats.totalGames) * 100}%` }}>
          {userStats.pause > 0 && <span>{(userStats.pause / userStats.totalGames) * 100}%</span>}
        </div>
      </div>

      <div className="user-progress-bar">
        <p>Desistido: {userStats.quit}</p>
        <div className="bar" style={{ width: `${(userStats.quit / userStats.totalGames) * 100}%` }}>
          {userStats.quit > 0 && <span>{(userStats.quit / userStats.totalGames) * 100}%</span>}
        </div>
      </div>
    </div>
  );
};

export default UserStats;