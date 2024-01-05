// GameDetails.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import GameStatus from '../../components/GamesStatus/GamesStatus';
import useInteractions from '../../hooks/useInteractions';

const GameDetails = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const {
    userClassification,
    handleClassificationChange,
    handleStatusChange,
    handleToggleFavorite,
    handleSaveChanges,
    totalInteractions,
    averageClassification
  } = useInteractions(gameId);

  const videoCode = gameData?.trailer ? gameData.trailer.split('v=')[1] : null;

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
      <p>Gênero: <span>{gameData.genres}</span></p>
      <p>Console: <span>{gameData.consoles}</span></p>
      <p>Desenvolvedora: {gameData.developers}</p>
      <p>Data de lançamento: <span>{new Date(`${gameData.releaseDate}T00:00:00`).toLocaleDateString()}</span></p>
      <p className='rating-age'>Idade recomendada: {gameData.rating}</p>

      <p className='classification-all'>Classificação Média: {Math.ceil(averageClassification) === 10 ? 10 : averageClassification.toFixed(averageClassification % 1 !== 0 ? 1 : 0)}</p>

      <p>{totalInteractions} usuário(s) interagiram com o jogo.</p>

      <GameStatus
        gameId={gameId}
        userClassification={userClassification}
        onClassificationChange={handleClassificationChange}
        onStatusChange={handleStatusChange}
        onToggleFavorite={handleToggleFavorite}
        onSaveChanges={handleSaveChanges}
      />

      {gameData.officialSite && (
        <Link to={gameData.officialSite} target='_blank'>
          <p>Site Oficial</p>
        </Link>
      )}

      {gameData.trailer && (
        <div className="field">
          <label>Trailer:</label>
          <iframe
            width="540"
            height="300"
            src={`https://www.youtube.com/embed/${videoCode}`}
            title="YouTube video player"
            allowFullScreen
          ></iframe>
        </div>
      )}


      <p>Adicionado por: {gameData.addedBy}</p>
      <p>Data de criação: <span>{new Date(gameData.createdAt).toLocaleString()}</span></p>
    </div>
  );
};

export default GameDetails;
