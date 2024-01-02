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

          // Atualiza o estado da classificação do usuário com a classificação do jogo
          setUserClassification(data.classifications?.[user?.uid] || 0);

          // Atualiza o estado do status do jogo para o usuário
          setUserGameStatus(data.userStatus?.[user?.uid] || null);
        } else {
          console.log(`Jogo com ID ${gameId} não encontrado.`);
        }
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchGameData();
  }, [gameId, user]);

  // Adiciona um observador para verificar a autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      setUser(authUser);
    });

    // Remove o observador quando o componente é desmontado
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

  const handleSaveChanges = async () => {
    if (!user) {
      alert('Faça login para salvar as alterações.');
      return navigate('/login');
    }

    // Atualiza a classificação individual do usuário no Firebase
    const database = getDatabase();
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

    // Calcula e atualiza a classificação total do jogo no Firebase
    const gameTotalRef = ref(database, `games/${gameId}/classification`);
    set(gameTotalRef, userClassification);

    setPendingChanges(false);
    alert('Alterações salvas com sucesso!');
  };

  if (!gameData) {
    return <p>Carregando...</p>;
  }

  // Calcula a classificação total dos usuários
  const totalClassifications = Object.values(gameData.classifications || {}).reduce((total, rating) => total + rating, 0);

  const averageClassification = totalClassifications / Object.keys(gameData.classifications || {}).length || 0;

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
        <select value={userGameStatus} onChange={handleStatusChange}>
          <option value="none">Nenhum</option>
          <option value="playing">Jogando</option>
          <option value="played">Jogado</option>
          <option value="planning">Planejando</option>
          {/* Adicione mais opções conforme necessário */}
        </select>
      </label>

      <label>
        Sua Classificação:
        <select value={userClassification} onChange={handleClassificationChange}>
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

      <button onClick={handleSaveChanges} disabled={!pendingChanges}>
        Salvar Alterações
      </button>

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
