import React, { useEffect } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';

const UserProfile = () => {
  const { currentUser, logout, loading, error } = useAuthentication();

  useEffect(() => {
    // Você pode adicionar lógica adicional aqui que precisa ser executada quando o componente monta.
    // Por exemplo, carregar dados adicionais do usuário, etc.
  }, [currentUser]);

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {currentUser && (
        <div>
          <p>Nome do Usuário: {currentUser.displayName}</p>
          <p>Email: {currentUser.email}</p>
          {/* Outras informações do usuário */}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
