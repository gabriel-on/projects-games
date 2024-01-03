// GameDetails.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import GameStatus from '../../components/GamesStatus/GamesStatus';  // Corrigi o nome do componente
import useInteractions from '../../hooks/useInteractions';

const GameDetails = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const {
    userClassification,
    numUsersInteracted,
    handleClassificationChange,
    handleStatusChange,
    handleToggleFavorite,
    handleSaveChanges,
  } = useInteractions(gameId);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const database = getDatabase();
        const gameRef = ref(database, `games/${gameId}`);
        const snapshot = await get(gameRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setGameData(data);
        } else {
          console.log(`Jogo com ID ${gameId} não encontrado.`);
        }
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchGameData();
  }, [gameId, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  if (!gameData) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>{gameData.title}</h2>
      <img src={gameData.image} alt={gameData.title} />
      <p>{gameData.description}</p>
      <p>{gameData.genres}</p>
      <p>{gameData.consoles}</p>
      <p className='rating-age'>Idade recomendada: {gameData.rating}</p>
      <p>Desenvolvedoras: {gameData.developers}</p>
      <p>Data de lançamento: <span>{gameData.releaseDate}</span></p>

      <GameStatus
        gameId={gameId}
        userClassification={userClassification}
        onClassificationChange={handleClassificationChange}
        onStatusChange={handleStatusChange}
        onToggleFavorite={handleToggleFavorite}
        onSaveChanges={handleSaveChanges}
      />

      <p>{numUsersInteracted} usuário(s) interagiram com o jogo.</p>

      {gameData.officialSite && (
        <Link to={gameData.officialSite} target='_blank'>
          <p>Site Oficial</p>
        </Link>
      )}

      <p>Adicionado por: {gameData.addedBy}</p>
    </div>
  );
};

export default GameDetails;
