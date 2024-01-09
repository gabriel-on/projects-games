import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase.js';
import { getDatabase, ref, get, remove } from 'firebase/database';
import ConfirmationModal from '../../components/ConfirmModal/ConfirmationModal.jsx';

const AdminPage = ({ isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dbInstance = getDatabase();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const usersRef = ref(dbInstance, 'users');
        get(usersRef).then((snapshot) => {
          if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersArray = Object.entries(usersData).map(([id, user]) => ({ id, ...user }));
            setUsers(usersArray);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dbInstance]);

  const handleDeleteUser = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const userRef = ref(dbInstance, `users/${selectedUserId}`);
    remove(userRef).then(() => {
      // Atualiza o estado local após a exclusão
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUserId));
      setIsModalOpen(false);
    }).catch((error) => {
      console.error('Erro ao excluir usuário:', error);
    });
  };

  const handleCancelDelete = () => {
    setSelectedUserId(null);
    setSelectedUserName('');
    setIsModalOpen(false);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!isAdmin) {
    return navigate("/");
  }

  const adminUsers = users.filter((user) => user.isAdmin);
  const regularUsers = users.filter((user) => !user.isAdmin);

  return (
    <div>
      <h1>Lista de Usuários Administradores</h1>
      <ul>
        {adminUsers.map((user, index) => (
          <li key={index}>
            <p>{user.displayName}</p>
            <p>É administrador: Sim</p>
          </li>
        ))}
      </ul>

      <h1>Lista de Usuários Normais</h1>
      <ul>
        {regularUsers.map((user) => (
          <li key={user.id}>
            <p>{user.displayName}</p>
            <p>É administrador: Não</p>
            <button onClick={() => handleDeleteUser(user.id, user.displayName)}>
              Excluir Usuário
            </button>
          </li>
        ))}
      </ul>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={selectedUserName}
      />
    </div>
  );
};

export default AdminPage;
