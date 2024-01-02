import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser && currentUser.isAdmin) {
        setIsAdmin(true);
      } else {
        // Redireciona para a página inicial se o usuário não for um administrador
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [currentUser, navigate]);
  console.log("currentUser:", currentUser);


  if (!isAdmin) {
    // Você pode personalizar a mensagem de acesso negado ou adicionar um link para a página inicial aqui
    return (
      <div>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Página de Administração</h1>
      {/* Conteúdo da página de administração */}
    </div>
  );
};

export default AdminPage;
