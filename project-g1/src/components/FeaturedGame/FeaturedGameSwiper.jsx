// FeaturedGame.js
import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import db from './firebase'; // Importe o arquivo firebase.js que você configurou

const FeaturedGame = () => {
  const gameRef = db.collection('featuredGames').doc('gameId'); // Substitua 'gameId' pelo ID do jogo em destaque

  const [game, loading, error] = useDocumentData(gameRef);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>;
  }

  if (!game) {
    return <p>Nenhum jogo em destaque encontrado.</p>;
  }

  return (
    <div>
      <h2>{game.title}</h2>
      <p>{game.description}</p>
      {/* Adicione outros detalhes do jogo conforme necessário */}
    </div>
  );
};

export default FeaturedGame;
