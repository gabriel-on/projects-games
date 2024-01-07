import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import GameStatus from '../GamesStatus/GamesStatus';

const UserProfile = () => {
  const { currentUser, logout, loading, error, auth, setCurrentUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [userAchievements, setUserAchievements] = useState({});

  useEffect(() => {
    if (currentUser) {
      loadFavoriteGames(currentUser.uid);
      loadUserAchievements(currentUser.uid);
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
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserAchievements(data);
        } else {
          setUserAchievements({});
        }
      });
    } catch (error) {
      console.error('Erro ao carregar conquistas do usuário:', error.message);
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
        setCurrentUser({
          ...currentUser,
          displayName: newDisplayName,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar o nome do usuário:', error.message);
    }
  };

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {currentUser && (
        <div>
          <h1>Perfil do Usuário</h1>
          <p>Nome do Usuário: {currentUser.displayName}</p>
          <p>Email: {currentUser.email}</p>

          {/* Adiciona todas as conquistas do usuário automaticamente */}
          <div>
            <h2>Todas as suas conquistas</h2>
            {Object.keys(userAchievements).map((achievementId) => (
              <div key={achievementId}>
                <h3>Conquista: {userAchievements[achievementId].name}</h3>
                <p>Descrição: {userAchievements[achievementId].description}</p>
                <p>Pontos: {userAchievements[achievementId].points}</p>
                {/* Adicione qualquer outra informação desejada */}
              </div>
            ))}
          </div>

          {/* Lista de jogos favoritos */}
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
