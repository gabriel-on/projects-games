// GameDetails.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useInteractions from '../../hooks/useInteractions';
import GameAnalysis from '../../components/GameAnalysis/GameAnalysis';
import '../GameDetails/GameDetails.css'
import GameStatusModal from '../../components/GamesStatus/GameStatusModal';
import SystemRequirementsTable from './SystemRequirementsTable';

const GameDetails = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [user, setUser] = useState(null);
  const [showGameStatusModal, setShowGameStatusModal] = useState(false);

  const navigate = useNavigate();
  const [gameAnalysis, setGameAnalysis] = useState([]);
  const {
    userClassification,
    handleClassificationChange,
    handleStatusChange,
    handleToggleFavorite,
    handleSaveChanges,
    totalInteractions,
    averageClassification
  } = useInteractions(gameId);

  const secondaryImages = gameData?.secondaryImages || [];

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

          // Buscar análises do jogo
          const analysisRef = ref(database, `gameAnalysis/${gameId}`);
          const analysisSnapshot = await get(analysisRef);

          if (analysisSnapshot.exists()) {
            const analysisData = analysisSnapshot.val();
            const analysisArray = Object.values(analysisData);
            setGameAnalysis(analysisArray);
          } else {
            setGameAnalysis([]);
          }
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
    <div className='game-details-container' id='container'>

      <div id="banner">
        <div className='secondary-images-container'>
          <ul>
            {secondaryImages.length > 0 ? (
              secondaryImages.map((image, index) => (
                <li key={index}>
                  <img src={image.link} alt={`Imagem ${index + 1}`} />
                </li>
              ))
            ) : (
              <li>
                <img src="../src/img/foto-padrao.png" alt="Foto Padrão" />
              </li>
            )}
          </ul>
        </div>
      </div>

      <div id="foto-do-jogo">
        <div className='details-div-foto'>
          <img src={gameData.image} alt={gameData.title} />
          <div id="status">
            <button onClick={() => setShowGameStatusModal(true)}>
              Marcar
            </button>
            {showGameStatusModal && (
              <GameStatusModal
                gameId={gameId}
                userClassification={userClassification}
                onClassificationChange={handleClassificationChange}
                onStatusChange={handleStatusChange}
                onToggleFavorite={handleToggleFavorite}
                onSaveChanges={handleSaveChanges}
                onClose={() => setShowGameStatusModal(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className='set-rating-classification-interactions'
        id='set-rci'>
        <p className='rating-age'>Idade: {gameData.rating}</p>
        <p className='classification-all'>Média: {Math.ceil(averageClassification) === 10 ? 10 : averageClassification.toFixed(averageClassification % 1 !== 0 ? 1 : 0)}</p>
        <p className='interactions-all'>{totalInteractions} usuário(s) interagiram com o jogo.</p>
        <div>
          <h1>{gameData.title}</h1>
          <h3>Gênero:</h3>
          <ul>
            {gameData.genres.map((genre, index) => (
              <li key={index}>{genre}</li>
            ))}
          </ul>
        </div>
      </div>

      <div id='trailer'>
        {gameData.trailer ? (
          <div className="field">
            <label>Trailer:</label>
            <iframe
              width="360"
              height="240"
              src={`https://www.youtube.com/embed/${videoCode}`}
              title="YouTube video player"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="field">
            <label>Trailer:</label>
            <p>Nenhum vídeo disponível.</p>
          </div>
        )}
      </div>

      <div id='info-container-details'>
        <div id="descrição">
          <div className='details-container'>
            <div className='description-container'>
              <p>{gameData.description}</p>
            </div>
          </div>
        </div>
        <div id='details-div'>
          <h2>Detalhes</h2>
          <div>
            <ul className="console-list">
              <p>Console:</p>
              {gameData.consoles.map((console, index) => (
                <li key={index}>{console}</li>
              ))}
            </ul>
            <ul className="developer-list">
              <p>Desenvolvedora:</p>
              {gameData.developers.map((developer, index) => (
                <li key={index}>{developer}</li>
              ))}
            </ul>
            <p>Data de lançamento: <span>{new Date(`${gameData.releaseDate}T00:00:00`).toLocaleDateString()}</span></p>
          </div>
        </div>
        {gameData.officialSites && (
          <div id="onde-comprar">
            <h3>Onde comprar</h3>
            <div className='sites-container'>
              <ul>
                {gameData.officialSites.map((site, index) => (
                  <li key={index}>
                    <a href={site.link} target="_blank" rel="noopener noreferrer">
                      {site.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {gameData.systemRequirements && (
          <div id="system-requirements">
            <SystemRequirementsTable systemRequirements={gameData.systemRequirements} />
          </div>
        )}
        <div id="analises">
          <div className='reviews-container'>
            {/* <h2>Sua Análise do Jogo</h2> */}
            <GameAnalysis gameId={gameId} />
          </div>
        </div>
      </div>
      <div id='createdBy'>
        <p>Adicionado por: {gameData.addedBy}</p>
        <p>Data de criação: <span>{new Date(gameData.createdAt).toLocaleString()}</span></p>
      </div>
    </div>
  );
};

export default GameDetails;