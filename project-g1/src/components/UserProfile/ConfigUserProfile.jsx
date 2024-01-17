import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import ChangeName from './ChangeName';

function ConfigUserProfile({ userId, user, currentUser, setCurrentUser }) {
  const [nameColor, setNameColor] = useState(user?.nameColor || '#000000');
  const [tempNameColor, setTempNameColor] = useState(nameColor);

  const handleColorChange = (color) => {
    setTempNameColor(color);
  };

  const handleSaveColor = async () => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      await set(userRef, { ...user, nameColor: tempNameColor });

      // Atualiza apenas a cor no objeto de usuário local de forma síncrona
      setCurrentUser((prevUser) => ({
        ...prevUser,
        nameColor: tempNameColor,
      }));

      alert('Cor atualizada com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar a cor do usuário:', error.message);
    }
  };

  return (
    <div>
      <h1>Configurações do Usuário</h1>
      <div>
        <p>Email: {user?.email}</p>
        <div>
          <p>Cor Atual: {nameColor}</p>
          <label>Escolher Nova Cor:</label>
          <input
            type="color"
            value={tempNameColor}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <button onClick={handleSaveColor}>Salvar Nova Cor</button>
        </div>

        <ChangeName
          userId={userId}
          user={user}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          nameColor={nameColor}
        />
      </div>
    </div>
  );
}

export default ConfigUserProfile;
