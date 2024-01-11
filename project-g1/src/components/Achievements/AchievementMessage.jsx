// AchievementMessage.js
import React from 'react';

const AchievementMessage = ({ message, details }) => {
  return (
    <div style={{ position: 'fixed', top: 85, left: 0, width: '100%', background: 'green', color: 'white', textAlign: 'center', padding: '10px' }}>
      <p>{message}</p>
      {details && (
        <div>
          <h4>Detalhes da Conquista:</h4>
          <p>Nome: {details.name}</p>
          <p>Descrição: {details.description}</p>
          <p>Pontos: {details.points}</p>
        </div>
      )}
    </div>
  );
};

export default AchievementMessage;
