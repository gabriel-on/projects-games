import React, { useState, useEffect } from 'react';
import { updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import UserAchievementsList from '../UserAchievementsList/UserAchievementsList';
import UserLevel from '../UserLevel/UserLevel';
import GameStatus from '../../components/GamesStatus/GamesStatus';
import '../../components/UserProfile/UserProfile.css'

import defaultProfileImage from '../../img/perfil.png';
import { useNavigate, useParams } from 'react-router-dom';

const UserProfile = () => {
  const { currentUser, logout, loading, error, auth, setCurrentUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [user, setUser] = useState(null);
  const [publicView, setPublicView] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate()
  const [confirmLevelUp, setConfirmLevelUp] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserProfile(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadFavoriteGames(userId);
      loadUserAchievements(userId);
      loadUserRanking(userId);
    }
  }, [userId]);

  const loadUserProfile = (userId) => {
    try {
      console.log('UserID:', userId);
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log('User data:', snapshot.val());
          const userData = snapshot.val();
          console.log('User Data:', userData);

          setUser(userData);
          loadFavoriteGames(userId);
          loadUserAchievements(userId);
          loadUserRanking(userId);

          // Verifica se userData.level é definido antes de salvar
          if (userData && userData.level !== undefined) {
            const userLevelRef = ref(db, `users/${userId}/level`);
            set(userLevelRef, userData.level);
          }
        } else {
          setUser(null);
          setFavoriteGames([]);
          setUserAchievements([]);
          setUserRanking(null);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error.message);
    }
  };

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

      const shouldUpdateName = window.confirm(`Deseja atualizar o nome para "${newDisplayName}"?`);

      if (shouldUpdateName) {
        await updateProfileAuth(auth.currentUser, { displayName: newDisplayName });

        if (currentUser.uid === userId) {
          // Calcula o nível do usuário apenas se estiver atualizando o próprio perfil
          const achievementsPoints = Object.values(userAchievements).reduce(
            (acc, achievement) => acc + (achievement.points || 0),
            0
          );

          const totalUserPoints = typeof userPoints === 'number' && !isNaN(userPoints) ? userPoints : 0;
          const adjustedPointsPerLevel = basePointsPerLevel * difficultyFactor;
          const totalPoints = totalUserPoints + achievementsPoints;
          const newLevel = Math.floor(totalPoints / adjustedPointsPerLevel);

          // Atualiza o nível no banco de dados apenas se o usuário autenticado for o mesmo que está sendo visualizado
          const db = getDatabase();
          const userLevelRef = ref(db, `usersLevel/${currentUser.uid}/level`);
          set(userLevelRef, newLevel);

          setCurrentUser({
            ...currentUser,
            displayName: newDisplayName,
          });
        }

        alert('Nome atualizado com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o nome do usuário:', error.message);
    }
  };

  return (
    <div className='profile-container'>
      {loading && <p>Carregando...</p>}
      {!currentUser && navigate('/')}
      {error && <p>{error}</p>}
      {user && (
        <div className='profile-content'>
          <div>
            <div className='standard-profile'>
              <img
                src={user.photoURL || defaultProfileImage}
                alt="Foto de Perfil"
              />
            </div>
            <h1>Perfil do Usuário</h1>
            <p>Nome do Usuário: {user.displayName}</p>

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
              <UserLevel
                userPoints={userPoints}
                userAchievements={userAchievements}
                userId={userId}
                currentUser={currentUser}
                confirmLevelUp={confirmLevelUp}
                setConfirmLevelUp={setConfirmLevelUp}
                
              />
            </div>
            <UserAchievementsList userId={user.uid} />
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
          {currentUser.uid === userId ? (
            // Modo de visualização privada para o próprio usuário
            <div>
              <button onClick={() => setPublicView(!publicView)}>
                {publicView ? 'Ver Perfil Privado' : 'Ver Perfil Público'}
              </button>
              <p>Email: {user.email}</p>
              <label htmlFor="newDisplayName">Novo Nome:</label>
              <input
                type="text"
                id="newDisplayName"
                value={newDisplayName}
                onChange={handleDisplayNameChange}
              />
              <button onClick={handleUpdateDisplayName}>Atualizar Nome</button>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            // Modo de visualização pública para outros usuários
            <div>
              <p>Este é o perfil de {user.displayName}.</p>
              {/* Adicione outras informações públicas aqui */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
