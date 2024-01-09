// GameAnalysis.js
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const GameAnalysis = ({ gameId }) => {
  const [deleteAnalysisId, setDeleteAnalysisId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [analysis, setAnalysis] = useState('');
  const [isAnalysisSubmitted, setIsAnalysisSubmitted] = useState(false);
  const [userName, setUserName] = useState('Usuário Anônimo');
  const [userAnalysis, setUserAnalysis] = useState(null);
  const [gameAnalysis, setGameAnalysis] = useState([]);
  const [gameData, setGameData] = useState(null);
  const database = getDatabase();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        const displayName = authUser.displayName || 'Usuário Anônimo';
        setUserName(displayName);
      } else {
        setUserName('Usuário Anônimo');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameRef = ref(database, `games/${gameId}`);
        const snapshot = await get(gameRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setGameData(data);

          const analysisRef = ref(database, `gameAnalysis/${gameId}`);
          const analysisSnapshot = await get(analysisRef);

          if (analysisSnapshot.exists()) {
            const analysisData = analysisSnapshot.val();
            const analysisArray = Object.values(analysisData);
            setGameAnalysis(analysisArray);

            // Encontrar a análise do usuário atual, se existir
            const currentUser = auth.currentUser;
            if (currentUser) {
              const currentUserAnalysis = analysisArray.find((analysis) => analysis.userId === currentUser.uid);
              setUserAnalysis(currentUserAnalysis || null);
              setAnalysis(currentUserAnalysis ? currentUserAnalysis.text : '');
            }
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
  }, [gameId, database, user]);

  const handleDeleteAnalysis = (analysisId) => {
    setDeleteAnalysisId(analysisId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteAnalysis = async () => {
    setIsConfirmModalOpen(false);

    try {
      const analysisRef = ref(database, `gameAnalysis/${gameId}/${deleteAnalysisId}`);
      await set(analysisRef, null);

      console.log('Análise excluída com sucesso!');
      // Recarregue os dados após a exclusão
      fetchGameData();
    } catch (error) {
      console.error('Erro ao excluir análise:', error);
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setDeleteAnalysisId(null);
  };

  const handleAnalysisSubmit = async () => {
    // Código existente de envio de análise

    setIsAnalysisSubmitted(true);
  };

  return (
    <div className='box-reviews-container'>
      <div>
        {user ? (
          <div>
            <h3>Sua Análise do Jogo:</h3>
            {userAnalysis ? (
              <div>
                <p>{userAnalysis.text}</p>
                <p>Data da Análise: {new Date(userAnalysis.timestamp).toLocaleString()}</p>
                <button onClick={() => handleDeleteAnalysis(userAnalysis.analysisId)}>
                  Excluir Análise
                </button>
              </div>
            ) : (
              <p>Faça sua análise</p>
            )}
          </div>
        ) : (
          <p>Faça login para deixar sua análise.</p>
        )}
      </div>
      <h2>Análise do Jogo</h2>
      <div>
        <textarea
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
          placeholder="Digite sua análise aqui..."
          maxLength={500} // Defina o limite de caracteres desejado
        />
        <p>Caracteres restantes: {500 - analysis.length}</p>
        <button onClick={handleAnalysisSubmit}>Enviar/Editar Análise</button>
      </div>

      {isAnalysisSubmitted && (
        <div>
          <p style={{ color: 'green' }}>
            Análise enviada com sucesso por {userName}!
          </p>
        </div>
      )}

      <div className=''>
        <p>Todos as Análises:</p>
        {gameAnalysis.length > 0 ? (
          <ul>
            {gameAnalysis.map((analysis) => (
              <li key={analysis.timestamp}>
                <p>{analysis.userName}: {analysis.text}</p>
                <span>Data da Análise: {new Date(analysis.timestamp).toLocaleString()}</span>
                {user && user.uid === analysis.userId && (
                  <button onClick={() => handleDeleteAnalysis(analysis.analysisId)}>
                    Excluir Análise
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma análise disponível.</p>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmDeleteAnalysis}
        message="Tem certeza de que deseja excluir esta análise?"
      />
    </div>
  );
};

export default GameAnalysis;
