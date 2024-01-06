import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const GameAnalysis = ({ gameId }) => {
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

    const handleAnalysisSubmit = async () => {
        if (analysis.trim() === '') {
            alert('A análise não pode estar vazia.');
            return;
        }

        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert('Usuário não autenticado. Faça login para enviar uma análise.');
            return;
        }

        try {
            const displayName = currentUser.displayName || 'Usuário Anônimo';

            let userAnalysisRef;

            // Se o usuário já tiver uma análise, atualize-a, senão, crie uma nova
            if (userAnalysis && userAnalysis.analysisId) {
                userAnalysisRef = ref(database, `gameAnalysis/${gameId}/${userAnalysis.analysisId}`);
            } else {
                const analysisRef = ref(database, `gameAnalysis/${gameId}`);
                const newAnalysisRef = push(analysisRef);
                const analysisId = newAnalysisRef.key;
                userAnalysisRef = newAnalysisRef;
            }

            await set(userAnalysisRef, {
                text: analysis,
                timestamp: Date.now(),
                userName: displayName,
                userId: currentUser.uid,
                analysisId: userAnalysisRef.key,
            });

            console.log('Análise enviada com sucesso!');
            setIsAnalysisSubmitted(true);
        } catch (error) {
            console.error('Erro ao enviar análise:', error);
        }
    };

    return (
        <div className='box-reviews-container'>
            <div>
                {user ? (
                    <div className=''>
                        {userAnalysis ? (
                            <div>
                                <p>Sua Análise do Jogo:</p>
                                <p>{userAnalysis.text}</p>
                            </div>
                        ) : (
                            <p>Faça sua analise</p>
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
                />
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
                                {analysis.userName}: {analysis.text}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhuma análise disponível.</p>
                )}
            </div>
        </div>
    );
};

export default GameAnalysis;
