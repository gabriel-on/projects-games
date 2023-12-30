// DeleteGame.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, remove, onValue } from 'firebase/database';
import { useParams, useNavigate } from 'react-router-dom';

// import '../AddGame/AddGame.css';

function DeleteGame() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const database = getDatabase();
    const gameRef = ref(database, `games/${gameId}`);

    onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        setGame(gameData);
      } else {
        // Se o jogo não for encontrado, redirecionar para a página inicial
        navigate('/dashboard');
      }
    });
  }, [gameId, navigate]);

  const handleDelete = async () => {
    const database = getDatabase();
    const gameRef = ref(database, `games/${gameId}`);

    try {
      await remove(gameRef);
      console.log('Jogo excluído com sucesso!');
      // Redirecionar para a página inicial após excluir o jogo
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao excluir o jogo:', error);
    }
  };

  return (
    <div>
      <h2>Excluir Jogo</h2>
      {game && (
        <div className='delete-game-container'>
          <p>Você tem certeza que deseja excluir o jogo "{game.title}"?</p>
          <button onClick={handleDelete}>Confirmar Exclusão</button>
        </div>
      )}
    </div>
  );
}

export default DeleteGame;
