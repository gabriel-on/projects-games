import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';

import { useAuth } from '../../hooks/useAuthentication';
import UserAchievementsList from '../UserAchievementsList/UserAchievementsList';
import UserLevel from '../UserLevel/UserLevel';
import GameStatus from '../../components/GamesStatus/GamesStatus';

import useInteractions from '../../hooks/useInteractions';

import '../../components/UserProfile/UserProfile.css'

import defaultProfileImage from '../../img/perfil.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserGameList from '../UserGameList/UserGameList';
import ConfigUserProfile from './ConfigUserProfile';
import ProfileImageUploader from './ProfileImageUploader';
import UserProfileBio from './UserProfileBio';
import GameStatusModal from '../GamesStatus/GameStatusModal';
import FollowGame from '../FollowGame/FollowGame';
import FavoriteGamesList from '../FavoriteGamesList/FavoriteGamesList';
import UserStats from '../UserStats/UserStats';

const UserProfile = () => {
  const { currentUser, logout, loading, error, auth, setCurrentUser } = useAuth();
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [user, setUser] = useState(null);
  const [publicView, setPublicView] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate()
  const [showConfig, setShowConfig] = useState(false);
  const [confirmLevelUp, setConfirmLevelUp] = useState(false);
  const [joinedAt, setJoinedAt] = useState(null);
  const [showGameStatusModal, setShowGameStatusModal] = useState(false);
  const { gameId } = useParams();

  const {
    userClassification,
    handleClassificationChange,
    handleStatusChange,
    handleToggleFavorite,
    handleSaveChanges,
    totalInteractions,
    averageClassification
  } = useInteractions(gameId);

  useEffect(() => {
    if (userId) {
      loadUserProfile(userId);
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
          setJoinedAt(userData.joinedAt);

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

  const toggleView = () => {
    if (currentUser.uid === userId) {
      // Se for o próprio usuário, exibir ou ocultar configurações
      setShowConfig(!showConfig);
    } else {
      // Se for outro usuário, alternar entre visualização pública/privada
      setPublicView(!publicView);
    }
  };

  const handleUploadSuccess = async (downloadURL) => {
    try {
      const auth = getAuth();
      await updateProfileAuth(auth.currentUser, {
        photoURL: downloadURL,
      });

      await loadUserProfile(currentUser.uid);
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error.message);
    }
  };

  const updateUserBio = (userId, bio) => {
    try {
      const db = getDatabase();
      const userBioRef = ref(db, `users/${userId}/bio`);
      set(userBioRef, bio);
    } catch (error) {
      console.error('Erro ao atualizar a biografia do usuário:', error.message);
    }
  };

  return (
    <div className='profile-container' >
      {loading && <p>Carregando...</p>}
      {!currentUser && navigate('/')}
      {error && <p>{error}</p>}
      {user && (
        <div className='profile-content' style={{ background: user.backgroundColor }}>
          <div>
            <div className='standard-profile'>
              <img
                src={user.photoURL || defaultProfileImage}
                alt="Foto de Perfil"
              />
            </div>
            <h1>Perfil do Usuário</h1>
            <p>Nome do Usuário: <span style={{ color: user.nameColor }}>{user.displayName}</span></p>
            <p>Membro Desde: {joinedAt ? new Date(joinedAt * 1000).toLocaleDateString() : 'Carregando...'}</p>
            <p className='user-bio-content'>{user.bio}</p>

            {/* Exibir o ranking do usuário */}
            <div>
              <h2 style={{ color: user.nameColor }}>Ranking</h2>
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
          </div>
          <div >
            <h2 style={{ color: user.nameColor }}>Nível</h2>
            <UserLevel
              userPoints={userPoints}
              userAchievements={userAchievements}
              userId={userId}
              currentUser={currentUser}
              confirmLevelUp={confirmLevelUp}
              setConfirmLevelUp={setConfirmLevelUp}
            />
          </div>
          <div>
            <h2 style={{ color: user.nameColor }}>Conquistas Resgatadas</h2>
            <UserAchievementsList userId={userId} />
          </div>

          <div>
            <UserStats
              userId={userId}
              gameId={gameId}
            />
          </div>

          {/* Lista de jogos favoritos */}
          <div className='FavoriteGamesList-container'>
            <h2 style={{ color: user.nameColor }}>Jogos Favoritos:</h2>
            <FavoriteGamesList favoriteGames={favoriteGames} />
          </div>

          {/* Lista de jogos seguidos */}
          <div className='UserGameList-container'>
            <h2 style={{ color: user.nameColor }}>Lista de Jogos Seguidos:</h2>
            <UserGameList userId={userId} />
          </div>

          {showConfig ? (
            <div>
              <ConfigUserProfile
                userId={userId}
                user={user}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
              <div>
                <UserProfileBio userId={userId} currentUser={currentUser} updateUserBio={updateUserBio} />
              </div>
              <div className='standard-profile'>
                <ProfileImageUploader userId={currentUser.uid} onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>
          ) : (
            <div>
              {/* ... Informações do perfil ... */}
              {currentUser.uid === userId ? (
                <div>
                  <button onClick={toggleView}>
                    {publicView ? 'Ocultar configurações' : 'Ver configurações'}
                  </button>
                </div>
              ) : (
                <div>
                  <p>Este é o perfil de <strong style={{ color: user.nameColor }}>{user.displayName}</strong>.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;