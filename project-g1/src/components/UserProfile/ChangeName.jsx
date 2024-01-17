import React, { useState } from 'react';
import { updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const ChangeName = ({ userId, user, currentUser, setCurrentUser, nameColor }) => {
  const [newDisplayName, setNewDisplayName] = useState('');

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
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);

        // Atualiza o nome e a cor no banco de dados
        await set(userRef, { ...user, displayName: newDisplayName, nameColor });

        // Atualiza o nome e a cor no objeto de usuário local
        setCurrentUser({
          ...currentUser,
          displayName: newDisplayName,
          nameColor,
        });

        alert('Nome atualizado com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o nome do usuário:', error.message);
    }
  };

  return (
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
  );
};

export default ChangeName;
