import React, { useState, useEffect } from 'react';
import { updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication'; // Certifique-se de importar corretamente o hook de autenticação
import UserAchievementsList from '../UserAchievementsList/UserAchievementsList';
import UserLevel from '../UserLevel/UserLevel';

const UserProfile = () => {
  const { currentUser, logout, loading, error, auth, setCurrentUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (currentUser) {
      loadUserAchievements(currentUser.uid);
    }
  }, [currentUser]);

  const loadUserAchievements = (userId) => {
    try {
      const db = getDatabase();
      const userAchievementsRef = ref(db, `userAchievements/${userId}`);

      // Use onValue para ouvir alterações no banco de dados
      onValue(userAchievementsRef, (snapshot) => {
        // Lógica para atualizar a lista de conquistas no estado, se necessário
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

          <div>
            <UserLevel userPoints={userPoints}/>
          </div>

          {/* Adiciona o componente UserAchievementsList para exibir as conquistas resgatadas */}
          <UserAchievementsList userId={currentUser.uid} />

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
