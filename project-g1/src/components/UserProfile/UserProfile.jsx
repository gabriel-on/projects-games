import React, { useState, useEffect } from 'react';
import { updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import UserAchievementsList from '../UserAchievementsList/UserAchievementsList';
import UserLevel from '../UserLevel/UserLevel';
import GameStatus from '../../components/GamesStatus/GamesStatus';
import '../../components/UserProfile/UserProfile.css'

import defaultProfileImage from '../../img/perfil.png';

const UserProfile = () => {
  const { currentUser, logout, loading, error, auth, setCurrentUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userRanking, setUserRanking] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadFavoriteGames(currentUser.uid);
      loadUserAchievements(currentUser.uid);
      loadUserRanking(currentUser.uid);
    }
  }, [currentUser]);

  const loadFavoriteGames = (userId) => {
    try {
      const db = getDatabase();
      const gamesRef = ref(db, 'games');

      onValue(gamesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const gameIds = Object.keys(data);

          const favoriteGames = gameIds
            .filter((gameId) => data[gameId].favorites && data[gameId].favorites[userId])
            .map((gameId) => ({
              id: gameId,
              ...data[gameId],
            }));

          setFavoriteGames(favoriteGames);
        } else {
          setFavoriteGames([]);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar jogos favoritos:', error.message);
    }
  };

  const loadUserAchievements = (userId) => {
    try {
      const db = getDatabase();
      const userAchievementsRef = ref(db, `userAchievements/${userId}`);

      onValue(userAchievementsRef, (snapshot) => {
        let totalPoints = 0;
        const achievementsData = {};

        snapshot.forEach((achievement) => {
          const achievementData = achievement.val();
          const achievementPoints = achievementData.points;
          totalPoints += achievementPoints;

          achievementsData[achievement.key] = achievementData;
        });

        setUserPoints(totalPoints);
        setUserAchievements(achievementsData);
      });
    } catch (error) {
      console.error('Erro ao carregar conquistas do usuário:', error.message);
    }
  };

  const loadUserRanking = (userId) => {
    try {
      const db = getDatabase();
      const userRankingsRef = ref(db, 'userRankings');

      onValue(userRankingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          const userRankingData = Object.entries(data).map(([userId, ranking]) => ({ userId, ...ranking }));

          const currentUserRanking = userRankingData.find((ranking) => ranking.userId === userId);
          setUserRanking(currentUserRanking || null);
        } else {
          setUserRanking(null);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar ranking do usuário:', error.message);
    }
  };

  const handleDisplayNameChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const handleUpdateDisplayName = async () => {
    try {
      if (newDisplayName.trim() === '') {
        alert('Digite um novo nome antes de atualizar.');
        return;
      }
      const newLevel = calculateUserLevel(totalPoints);
      if (newLevel !== userLevel) {
        // Atualiza o nível no banco de dados
        const db = getDatabase();
        const userRef = ref(db, `users/${currentUser.uid}`);
        await set(userRef, { ...currentUser, level: newLevel }); // Supondo que 'users' seja a coleção de usuários no seu banco de dados

        // Atualiza o estado local com o novo nível
        setUserLevel(newLevel);
      }

      const shouldUpdateName = window.confirm(`Deseja atualizar o nome para "${newDisplayName}"?`);

      if (shouldUpdateName) {
        await updateProfileAuth(auth.currentUser, { displayName: newDisplayName });
        setCurrentUser({
          ...currentUser,
          displayName: newDisplayName,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar o nome do usuário:', error.message);
    }
  };

  const userId = '';

  return (
    <div className='profile-container'>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {currentUser && (
        <div className='profile-content'>
          <div>
            <div className='standard-profile'>
              <img
                src={currentUser.photoURL || defaultProfileImage}
                alt="Foto de Perfil"
              />
            </div>
            <h1>Perfil do Usuário</h1>
            <p>Nome do Usuário: {currentUser.displayName}</p>
            <p>Email: {currentUser.email}</p>
            {/* Exibir o ranking do usuário */}
            <div>
              <h2>Ranking</h2>
              {userRanking && (
                <div>
                  <p>
                    Ranking: <strong>{userRanking.nome}</strong>
                  </p>
                  <p>
                    Dificuldade: {userRanking.dificuldade}
                  </p>
                  <p>
                    Porcentagem: {userRanking.porcentagem}%
                  </p>
                </div>
              )}
            </div>
            <div>
              <h2>Nível</h2>
              <UserLevel userPoints={userPoints} userAchievements={userAchievements} userId={currentUser.uid} />
            </div>
            <UserAchievementsList userId={currentUser.uid} />
          </div>

          {/* Lista de jogos favoritos */}
          <div className='favorites-container'>
            {favoriteGames.length > 0 && (
              <div>
                <h2>Jogos Favoritos:</h2>
                <ul>
                  {favoriteGames.map((game) => (
                    <li key={game.id}>
                      {game.title}
                      <GameStatus gameId={game.id} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Outras informações do usuário */}
          <div>
            <label htmlFor="newDisplayName">Novo Nome:</label>
            <input
              type="text"
              id="newDisplayName"
              value={newDisplayName}
              onChange={handleDisplayNameChange}
            />
            <button onClick={handleUpdateDisplayName}>Atualizar Nome</button>
          </div>

          {/* Botão de Logout */}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
