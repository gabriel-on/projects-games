import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import GameStatus from '../GamesStatus/GamesStatus';

const UserProfile = () => {
  const { currentUser, logout, loading, error, auth, setCurrentUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [favoriteGames, setFavoriteGames] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadFavoriteGames(currentUser.uid); // Passa o UID do usuário autenticado
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

          // Filtra apenas os jogos favoritos do usuário autenticado
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

  const handleDisplayNameChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const handleUpdateDisplayName = async () => {
    try {
      await updateProfileAuth(auth.currentUser, { displayName: newDisplayName });
      setCurrentUser({
        ...currentUser,
        displayName: newDisplayName,
      });
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
          <p>Nome do Usuário: {currentUser.displayName}</p>
          <p>Email: {currentUser.email}</p>
          {/* Lista de jogos favoritos */}
          {favoriteGames.length > 0 && (
            <div>
              <p>Jogos Favoritos:</p>
              <ul>
                {favoriteGames.map((game) => (
                  <li key={game.id}>{game.title}
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
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
