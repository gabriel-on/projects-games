import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import ChangeName from './ChangeName';

function ConfigUserProfile({ userId, user, currentUser, setCurrentUser }) {
  const [nameColor, setNameColor] = useState(user?.nameColor || 'black');
  const [tempNameColor, setTempNameColor] = useState(nameColor); // Novo estado para rastrear temporariamente a cor

  const handleColorChange = (color) => {
    setTempNameColor(color); // Atualiza temporariamente a cor ao escolher uma nova
  };

  const handleUpdateColor = async () => {
    try {
      // Atualiza apenas a cor no banco de dados
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      await set(userRef, { ...user, nameColor: tempNameColor });

      // Atualiza apenas a cor no objeto de usuário local
      setCurrentUser({
        ...currentUser,
        nameColor: tempNameColor,
      });

      alert('Cor atualizada com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar a cor do usuário:', error.message);
    }
  };

  return (
    <div>
      <h1>Configurações do Usuário</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <div>
            <p>Cor Atual: {nameColor}</p>
            <label>Escolher Nova Cor:</label>
            <input
              type="color"
              value={tempNameColor} // Usa tempNameColor temporariamente
              onChange={(e) => handleColorChange(e.target.value)}
            />
            <button onClick={handleUpdateColor}>Atualizar Cor</button> {/* Novo botão para atualizar a cor */}
          </div>

          <ChangeName
            userId={userId}
            user={user}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            nameColor={nameColor}
          />
        </div>
      )}
    </div>
  );
}

export default ConfigUserProfile;
