import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { updateProfile as updateProfileAuth } from "firebase/auth"; // Importe a função updateProfileAuth

const UserProfile = () => {
  const { currentUser, logout, loading, error, auth, setCurrentUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState('');

  useEffect(() => {
    // Lógica adicional que precisa ser executada quando o componente monta.
    // Por exemplo, carregar dados adicionais do usuário, etc.
  }, [currentUser]);

  const handleDisplayNameChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const handleUpdateDisplayName = async () => {
    try {
      await updateProfileAuth(auth.currentUser, { displayName: newDisplayName });
      // Atualiza o estado do usuário com o novo displayName
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