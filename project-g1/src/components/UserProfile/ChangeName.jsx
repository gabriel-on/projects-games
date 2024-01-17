import React, { useState } from 'react';
import { updateProfile as updateProfileAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const ChangeName = ({ userId, user, currentUser, setCurrentUser }) => {
  const [newDisplayName, setNewDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState(user.nameColor || 'black'); // Inicializa com a cor atual do usuário ou preto se não houver cor

  const handleDisplayNameChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
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
        await set(userRef, { ...user, displayName: newDisplayName, nameColor: selectedColor });

        // Atualiza o nome e a cor no objeto de usuário local
        setCurrentUser({
          ...currentUser,
          displayName: newDisplayName,
          nameColor: selectedColor,
        });

        alert('Nome atualizado com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o nome do usuário:', error.message);
    }
  };

  // Cores pré-definidas
  const predefinedColors = ['red', 'green', 'blue', 'yellow', 'purple'];

  return (
    <div>
      <label htmlFor="newDisplayName">Novo Nome:</label>
      <input
        type="text"
        id="newDisplayName"
        value={newDisplayName}
        onChange={handleDisplayNameChange}
      />

      <label htmlFor="colorSelector">Escolher Cor:</label>
      <select id="colorSelector" onChange={handleColorChange} value={selectedColor}>
        <option value="">Selecione uma cor</option>
        {predefinedColors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>

      <button onClick={handleUpdateDisplayName}>Atualizar Nome</button>
    </div>
  );
};

export default ChangeName;