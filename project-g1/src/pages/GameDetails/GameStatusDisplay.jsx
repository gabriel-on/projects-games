import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const GameStatusDisplay = ({ userStatus, gameId }) => {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log('Iniciando busca por detalhes do usuário...');

        const database = getDatabase();

        // Mapear userIds para Promise que retorna o detalhe do usuário
        const userDetailPromises = Object.keys(userStatus).map(async (userId) => {
          console.log(`Buscando detalhes para o usuário com ID ${userId}...`);

          const userRef = ref(database, `users/${userId}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();

          console.log(`Detalhes encontrados para o usuário com ID ${userId}:`, userData);

          return {
            userId,
            displayName: userData?.displayName || userId, // Usar userId se o displayName não estiver disponível
          };
        });

        // Aguardar todas as Promises
        const userDetailsArray = await Promise.all(userDetailPromises);

        console.log('Detalhes de todos os usuários obtidos:', userDetailsArray);

        // Mapear os resultados para um objeto userDetails
        const userDetailsObject = userDetailsArray.reduce((acc, { userId, displayName }) => {
          acc[userId] = { displayName };
          return acc;
        }, {});

        console.log('Atualizando estado userDetails:', userDetailsObject);

        setUserDetails(userDetailsObject);

        console.log('Busca por detalhes do usuário concluída.');
      } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
      }
    };

    fetchUserDetails();
  }, [userStatus]);

  console.log('Renderizando componente GameStatusDisplay com userDetails:', userDetails);

  return (
    <div>
      <h2>Status dos Usuários</h2>
      <ul>
        {Object.entries(userStatus).map(([userId, status]) => (
          <li key={userId}>
            <strong>{userDetails[userId]?.displayName || userId}:</strong> {status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameStatusDisplay;
