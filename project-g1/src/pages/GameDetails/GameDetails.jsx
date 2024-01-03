import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import '../GameDetails/GameDetails.css';

const GameDetails = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [userClassification, setUserClassification] = useState(0);
  const [user, setUser] = useState(null);
  const [userGameStatus, setUserGameStatus] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const database = getDatabase();
        const gameRef = ref(database, `games/${gameId}`);

        const snapshot = await get(gameRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setGameData(data);

          setUserClassification(data.classifications?.[user?.uid] || 0);
          setUserGameStatus(data.userStatus?.[user?.uid] || null);
          setIsFavorite(data.favorites?.[user?.uid] || false);
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

  const handleClassificationChange = (event) => {
    const newClassification = parseFloat(event.target.value);
    setUserClassification(newClassification);
    setPendingChanges(true);
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setUserGameStatus(newStatus);
    setPendingChanges(true);
  };

  const handleToggleFavorite = () => {
    if (!user) {
      alert('Faça login para adicionar aos favoritos.');
      return navigate('/login');
    }

    const database = getDatabase();
    const favoritesRef = ref(database, `games/${gameId}/favorites/${user.uid}`);
    setIsFavorite((prevFavorite) => !prevFavorite);
    set(favoritesRef, !isFavorite);
  };

  const handleSaveChanges = async () => {
    if (!user) {
      alert('Faça login para salvar as alterações.');
      return navigate('/login');
    }

    const database = getDatabase();

    // Atualiza a classificação individual do usuário no Firebase
    const userClassificationRef = ref(database, `games/${gameId}/classifications/${user.uid}`);
    set(userClassificationRef, userClassification);

    // Atualiza a classificação do usuário para o jogo no perfil do usuário
    const userGameClassificationRef = ref(database, `users/${user.uid}/classifications/${gameId}`);
    set(userGameClassificationRef, userClassification);

    // Atualiza o status do jogo para o usuário no Firebase
    const userGameStatusRef = ref(database, `games/${gameId}/userStatus/${user.uid}`);
    set(userGameStatusRef, userGameStatus);

    // Atualiza o status do jogo para o usuário no perfil do usuário
    const userGameStatusProfileRef = ref(database, `users/${user.uid}/gameStatus/${gameId}`);
    set(userGameStatusProfileRef, userGameStatus);

    // Atualiza a classificação total do jogo no Firebase
    const gameTotalRef = ref(database, `games/${gameId}/classification`);
    set(gameTotalRef, userClassification);

    setPendingChanges(false);
    alert('Alterações salvas com sucesso!');
  };

  if (!gameData) {
    return <p>Carregando...</p>;
  }

  const totalClassifications = Object.values(gameData.classifications || {}).reduce((total, rating) => total + rating, 0);
  const averageClassification = totalClassifications / Object.keys(gameData.classifications || {}).length || 0;
  const numUsersInteracted = Object.keys(gameData.classifications || {}).length;

  return (
    <div>
      <h2>{gameData.title}</h2>
      <img src={gameData.image} alt={gameData.title} />
      <p>{gameData.description}</p>
      <p>{gameData.genres}</p>
      <p>{gameData.consoles}</p>
      <p className='rating-age'>Idade recomendada: {gameData.rating}</p>
      <p>Desenvolvedoras: {gameData.developers}</p>
      <p className='classification-all'>Classificação Média: {averageClassification}</p>
      <p>Data de lançamento: <span>{gameData.releaseDate}</span></p>

      <label>
        Seu Status:
        <select value={userGameStatus || ''} onChange={handleStatusChange}>
          <option value="none">Nenhum</option>
          <option value="planning">Planejando</option>
          <option value="playing">Jogando</option>
          <option value="played">Jogado</option>
        </select>
      </label>

      <label>
        Sua Classificação:
        <select value={userClassification || ''} onChange={handleClassificationChange}>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
      </label>

      <button onClick={handleToggleFavorite}>
        {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
      </button>

      <button onClick={handleSaveChanges} disabled={!pendingChanges}>
        Salvar Alterações
      </button>

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
