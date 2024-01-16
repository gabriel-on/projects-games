import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

const PointAccumulator = ({ userId, initialPoints, levelUpThreshold, onLevelUp }) => {
  const [points, setPoints] = useState(initialPoints);

  const handleIncrementPoints = async () => {
    // Incrementar os pontos quando uma ação ocorre (pode ser um clique em um botão, por exemplo)
    setPoints((prevPoints) => prevPoints + 1);

    // Verificar se atingiu o limite para subir de nível
    if (points >= levelUpThreshold) {
      try {
        // Atualizar os pontos no nó do usuário no Realtime Database
        const db = getDatabase();
        const userPointsRef = ref(db, `userPoints/${userId}`);
        await set(userPointsRef, points);

        // Chamar a função de subir de nível passada como prop
        onLevelUp();

        // Zerar os pontos após subir de nível
        setPoints(0);
      } catch (error) {
        console.error('Erro ao salvar pontos:', error.message);
      }
    }
  };

  return (
    <div>
      <p>Pontos acumulados: {points}</p>
      <button onClick={handleIncrementPoints}>Acumular Pontos</button>
    </div>
  );
};

export default PointAccumulator;
