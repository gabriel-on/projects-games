import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication'; // Substitua pelo seu provedor de autenticação
import { useNavigate } from 'react-router-dom'; // Importe o hook useHistory para redirecionamento

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); // Instancie o hook useHistory para redirecionamento

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Verifica se o usuário é um administrador ao montar o componente
      if (currentUser && currentUser.isAdmin) {
        setIsAdmin(true);
      } else {
        // Redireciona ou mostra uma mensagem de erro se o usuário não for um administrador
        // Você pode implementar isso de acordo com sua lógica específica
        console.error('Acesso negado. Você não é um administrador.');
        // Exemplo: redirecionamento para a página inicial
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [currentUser, navigate]);

  if (!isAdmin) {
    return (
      <div>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        {/* Pode adicionar um botão ou link para redirecionar para a página inicial, por exemplo */}
        {/* <Link to="/">Ir para a Página Inicial</Link> */}
      </div>
    );
  }

  // Renderiza o conteúdo da página de administração
  return (
    <div>
      <h1>Página de Administração</h1>
      {/* Conteúdo da página de administração */}
    </div>
  );
};

export default AdminPage;