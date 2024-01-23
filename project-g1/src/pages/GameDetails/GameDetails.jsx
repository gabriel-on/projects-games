import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useInteractions from '../../hooks/useInteractions';
import GameAnalysis from '../../components/GameAnalysis/GameAnalysis';

// CSS
import '../GameDetails/GameDetails.css'

import GameStatusModal from '../../components/GamesStatus/GameStatusModal';
import SystemRequirementsTable from './SystemRequirementsTable';
import LikeDislike from '../../components/LikeDislike/LikeDislike';
import FollowGame from '../../components/FollowGame/FollowGame';

const GameDetails = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [user, setUser] = useState(null);
  const [showGameStatusModal, setShowGameStatusModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const simulateLoading = async () => {
      try {
        // Simule um carregamento para demonstração
        for (let i = 0; i <= 100; i += 50) {
          setLoadingProgress(i);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error during loading:', error);
      }
    };

    simulateLoading();

    // Cleanup function (optional)
    return () => {
      // Additional cleanup logic if needed
    };
  }, []);

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

  const [userDisplayName, setUserDisplayName] = useState({
    displayName: null,
    nameColor: null,
  });

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

          // Buscar dados do usuário que adicionou o jogo
          const userRef = ref(database, `users/${data.addedBy.userId}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setUserDisplayName({
              displayName: userData.displayName,
              nameColor: userData.nameColor,
            });
          } else {
            console.log(`Usuário com ID ${data.addedBy.userId} não encontrado.`);
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
    return
  }

  const formatarData = (dataString) => {
    const opcoesFormato = { day: 'numeric', month: 'long', year: 'numeric' };
    const data = new Date(`${dataString}T00:00:00`);
    return data.toLocaleDateString(undefined, opcoesFormato);
  };

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
        </div>
        <div
          className='set-rating-classification-interactions'
          id='info-status-container'>
          <div id="status">
            <div className='title-date'>
              <h1>{gameData.title}</h1>
              {gameData.releaseDate ? (
                <p>Data de lançamento: <span>{new Date(`${gameData.releaseDate}T00:00:00`).toLocaleDateString()}</span></p>
              ) : (
                <p>Data de lançamento não especificada: <span>{gameData.unspecifiedReleaseDate}</span></p>
              )}

            </div>
            <div>
              <button onClick={() => setShowGameStatusModal(true)}>
                <i className="bi bi-bookmarks-fill"></i>
              </button>
              <>
                <FollowGame gameId={gameId} />
              </>
            </div>
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
            <div>
              <LikeDislike itemId={gameId} userId={user?.uid} />
            </div>
          </div>
          <div>
            <p className='rating-age'>Idade: {gameData.rating}</p>
            <p className='classification-all'>Média: {Math.ceil(averageClassification) === 10 ? 10 : averageClassification.toFixed(averageClassification % 1 !== 0 ? 1 : 0)}</p>
            <p className='interactions-all'>{totalInteractions} usuário(s) interagiram com o jogo.</p>
          </div>
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
          <h2>Descrição</h2>
          <div className='description-container'>
            <p>{gameData.description}</p>
          </div>
        </div>
        <div id='details-div'>
          <h2>Detalhes</h2>
          <div>
            <ul className='genre-list'>
              <p>Gênero:</p>
              {gameData.genres.map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
            <ul className="console-list">
              <p>Console:</p>
              {gameData.consoles.map((console, index) => (
                <li key={index}>{console}</li>
              ))}
            </ul>
            <ul className="developer-list">
              <p>Desenvolvedor:</p>
              {gameData.developers.map((developer, index) => (
                <li key={index}>{developer}</li>
              ))}
            </ul>
            <ul className="publisher-list">
              <p>Distribuidora:</p>
              {gameData.publishers.map((publisher, index) => (
                <li key={index}>{
                  publisher}</li>
              ))}
            </ul>
            {/* <ul className="language-list">
              <p>Idiomas Suportados:</p>
              {gameData.supportedLanguages.map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul> */}
            <ul className="player-list">
              <p>Players:</p>
              {gameData.players.map((player, index) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
            <p>Data de lançamento: <span>{formatarData(gameData.releaseDate) || gameData.unspecifiedReleaseDate}</span></p>
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
        <div className='supported-Languages-container'>
          <h2>Idiomas Suportados</h2>
          <table>
            <thead>
              <tr>
                <th>Idioma</th>
                <th>Interface</th>
                <th>Dublagem</th>
                <th>Legendas</th>
              </tr>
            </thead>
            <tbody>
              {gameData.supportedLanguages.map((language, index) => (
                <tr key={index}>
                  <td>{language}</td>
                  <td>{gameData[`interface_${language}`] === 'true' ? 'Sim' : 'Não'}</td>
                  <td>{gameData[`dubbing_${language}`] === 'true' ? 'Sim' : 'Não'}</td>
                  <td>{gameData[`subtitles_${language}`] === 'true' ? 'Sim' : 'Não'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <p>
          Adicionado por:{" "}
          <Link to={`/profile/${gameData.addedBy.userId}`} style={{ color: userDisplayName.nameColor }}>
            {userDisplayName.displayName || gameData.addedBy.displayName}
          </Link>
        </p>

        <p>Data de criação: <span>{new Date(gameData.createdAt).toLocaleString()}</span></p>
      </div>

    </div>
  );
};

export default GameDetails;