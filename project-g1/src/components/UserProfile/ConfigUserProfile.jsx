import React, { useState } from 'react';
import ChangeName from './ChangeName';

function ConfigUserProfile({ userId, user, currentUser, setCurrentUser }) {
  // Estado para rastrear a cor escolhida
  const [nameColor, setNameColor] = useState(user?.nameColor || 'black'); // Usa o operador de coalescência nula para lidar com o caso em que user é undefined

  // Função para atualizar a cor escolhida
  const handleColorChange = (color) => {
    setNameColor(color);
  };

  return (
    <div>
      {user && (
        <div>
          <p>Email: {user.email}</p>

          {/* Exibe a cor atual e permite que o usuário escolha uma nova cor */}
          <div>
            <p>Cor Atual: {nameColor}</p>
            <label>Escolher Nova Cor:</label>
            <input
              type="color"
              value={nameColor}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>

          {/* Passa a cor escolhida para o componente ChangeName */}
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