import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

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
      <p>Total de Jogos: {userStats.totalGames}</p>
      <p>Zerados: {userStats.gamesPlayed}</p>
      <p>Jogando: {userStats.gamesInProgress}</p>
      <p>Favoritos: {userStats.favoriteGames}</p>
      <p>Planejando: {userStats.planning}</p>
      <p>Re-Jogando: {userStats.rePlaying}</p>
      <p>Pausado: {userStats.pause}</p>
      <p>Desistido: {userStats.quit}</p>
    </div>
  );
};

export default UserStats;