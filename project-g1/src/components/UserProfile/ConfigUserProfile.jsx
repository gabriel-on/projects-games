import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import ChangeName from './ChangeName';

function ConfigUserProfile({ userId, user, currentUser, setCurrentUser }) {
  const [nameColor, setNameColor] = useState(user?.nameColor || '#000000');
  const [backgroundColor, setBackgroundColor] = useState(user?.backgroundColor || '#FFFFFF');
  const [tempNameColor, setTempNameColor] = useState(nameColor);
  const [tempBackgroundColor, setTempBackgroundColor] = useState(backgroundColor);

  const handleColorChange = (color, setColorCallback) => {
    setColorCallback(color);
  };

  const handleSaveColor = async () => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      await set(userRef, { ...user, nameColor: tempNameColor, backgroundColor: tempBackgroundColor });

      // Atualiza as cores no objeto de usuário local de forma síncrona
      setCurrentUser((prevUser) => ({
        ...prevUser,
        nameColor: tempNameColor,
        backgroundColor: tempBackgroundColor,
      }));

      alert('Cores atualizadas com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar as cores do usuário:', error.message);
    }
  };

  return (
    <div>
      <h1>Configurações do Usuário</h1>
      <div>
        <p>Email: {user?.email}</p>

        <div>
          <p>Cor do Texto Atual: {nameColor}</p>
          <label>Escolher Nova Cor do Texto:</label>
          <input
            type="color"
            value={tempNameColor}
            onChange={(e) => handleColorChange(e.target.value, setTempNameColor)}
          />
        </div>

        <div>
          <p>Cor de Fundo Atual: {backgroundColor}</p>
          <label>Escolher Nova Cor de Fundo:</label>
          <input
            type="color"
            value={tempBackgroundColor}
            onChange={(e) => handleColorChange(e.target.value, setTempBackgroundColor)}
          />
        </div>

        <button onClick={handleSaveColor}>Salvar Novas Cores</button>

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
