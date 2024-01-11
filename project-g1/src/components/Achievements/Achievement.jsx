import React from 'react';

const Achievement = ({ name, description, points }) => {
  return (
    <div>
      <h2>{name}</h2>
      <div>
        <p>{description}</p>
        <p>Pontos: {points}</p>
      </div>
    </div>
  );
};

export default Achievement;

