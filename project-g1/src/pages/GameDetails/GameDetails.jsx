import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import '../GameDetails/GameDetails.css'

const GameDetails = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [userClassification, setUserClassification] = useState(0);
  const [user, setUser] = useState(null);

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

    if (!user) {
      alert('Faça login para classificar o jogo.');
      return;
    }

    // Atualiza o estado da classificação do usuário
    setUserClassification(newClassification);

    // Atualiza a classificação individual do usuário no Firebase
    const database = getDatabase();
    const userClassificationRef = ref(database, `games/${gameId}/classifications/${user.uid}`);
    set(userClassificationRef, newClassification);

    // Calcula e atualiza a classificação total do jogo no Firebase
    const gameTotalRef = ref(database, `games/${gameId}/classification`);
    set(gameTotalRef, newClassification);
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
      <p>Adicionado por: {gameData.addedBy}</p>

      <label>
        Sua Classificação:
        <select value={userClassification} onChange={handleClassificationChange}>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>

      {gameData.officialSite && (
        <Link to={gameData.officialSite} target='_blank'>
          <p>Site Oficial</p>
        </Link>
      )}
    </div>
  );
};

export default GameDetails;
