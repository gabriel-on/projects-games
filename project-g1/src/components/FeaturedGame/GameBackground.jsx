// GameBackground.jsx
import React from 'react';

const GameBackground = ({ backgroundImage }) => {
  const backgroundImageStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <div className="game-background" style={backgroundImageStyle}>
      {/* Conteúdo adicional do fundo do jogo, se necessário */}
    </div>
  );
};

export default GameBackground;