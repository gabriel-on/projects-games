import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebase.js';
import { getDatabase, ref, onValue, get } from 'firebase/database';

const AdminPage = () => {
  const [userRole, setUserRole] = useState('user');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = ref(db, 'users/' + user.uid);

        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUserRole(userData?.role || 'user');
        });

        // Obtendo a lista de usuários
        const usersRef = ref(db, 'users');
        get(usersRef).then((snapshot) => {
          if (snapshot.exists()) {
            const usersData = snapshot.val();
            // Transformando os dados do objeto em uma matriz para mapear
            const usersArray = Object.values(usersData);
            setUsers(usersArray);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (userRole !== 'isAdmin') {
    console.log("Sucesso")
  } else {
    return navigate("/")
  }

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <p>{user.displayName}</p>
            {user.isAdmin && 
            <span>⭐ Administrador </span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;