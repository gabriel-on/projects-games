import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { ref, getDatabase, push, runTransaction } from 'firebase/database';
import '../JogoDaVelha/JogoDaVelha.css';

const TicTacToe = () => {
    const { user } = useAuth();
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [isAgainstMachine, setIsAgainstMachine] = useState(false);
    const [pointsSaved, setPointsSaved] = useState(false);
    const { getCurrentUser } = useAuth();

    const handleClick = (index) => {
        if (!board[index] && !winner && (isAgainstMachine || (xIsNext && !isAgainstMachine))) {
            const newBoard = board.slice();
            newBoard[index] = xIsNext ? 'X' : 'O';
            setBoard(newBoard);
            setXIsNext(!xIsNext);
        }
    };

    const handleSavePoints = async () => {
        if (!pointsSaved) {
            console.log('Botão "Save Points" clicado');
            const currentUser = getCurrentUser();

            if (currentUser && currentUser.uid) {
                try {
                    // Atualize a pontuação diretamente para o nó do usuário
                    await updateScoresInRealtimeDatabase(currentUser.uid, 'usersScore', 0);

                    // Defina pointsSaved como true para indicar que os pontos foram salvos
                    setPointsSaved(true);

                    // Mensagem de depuração para indicar que a atualização foi bem-sucedida
                    console.log('Atualização de pontos bem-sucedida!');
                } catch (error) {
                    // Mensagem de depuração em caso de erro durante a atualização
                    console.error('Erro ao salvar pontos:', error);
                }
            } else {
                // Mensagem de depuração se o usuário não estiver autenticado
                console.warn('Usuário não autenticado ou não possui um UID. Não é possível salvar pontos.');
            }
        } else {
            // Mensagem de depuração se os pontos já foram salvos
            console.warn('Os pontos já foram salvos anteriormente.');
        }
    };

    const handleToggleMode = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setXIsNext(true);
        setIsAgainstMachine(!isAgainstMachine);
        setPointsSaved(false);
    };

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    useEffect(() => {
        const handleWinner = () => {
            const winnerPlayer = calculateWinner(board);
            if (winnerPlayer && !winner) {
                let scoreDelta = 10; // Pontuação padrão em caso de vitória

                let winnerName = 'Unknown User';

                if (user && winnerPlayer === 'X') {
                    // Se o vencedor for o jogador humano ('X'), use o nome do usuário
                    winnerName = user.displayName || winnerName;
                }

                setWinner((prevWinner) => ({
                    name: winnerName,
                    symbol: winnerPlayer,
                }));

                if (user && user.uid && winnerPlayer === 'X') {
                    // Atualizar pontuações no Realtime Database apenas se o vencedor for um jogador humano ('X')
                    updateScoresInRealtimeDatabase(user.uid, 'usersScore', scoreDelta);
                } else {
                    // Mensagem de depuração se o vencedor não for um jogador humano ou se o usuário não estiver autenticado ou não possuir um UID
                    console.warn('Vencedor não é um jogador humano ou usuário não autenticado ou não possui um UID. Não é possível salvar pontos.');
                }
            }
        };

        handleWinner();

        // Salvar automaticamente ao terminar a partida
        if (winner || (board.every(cell => cell !== null) && !winner)) {
            if (user) {
                // Não passe 0, apenas atualize se a pontuação precisar ser recalculada
                let scoreDelta = 0;

                if (calculateWinner(board) === 'O') {
                    // Se o jogador 'O' ganhou, ganhe metade da pontuação
                    scoreDelta = -5;
                }

                updateScoresInRealtimeDatabase(user.uid, 'usersScore', scoreDelta);
            }
        }
    }, [board, isAgainstMachine, winner, user]);

    const updateScoresInRealtimeDatabase = async (userId, node, scoreDelta) => {
        const db = getDatabase();
        const userRef = ref(db, `${node}/${userId}/0`);

        // Use runTransaction para garantir uma atualização atômica
        try {
            await runTransaction(userRef, (userData) => {
                if (!userData) {
                    return {
                        score: 10 + scoreDelta,
                        wins: 1,
                        displayName: user?.displayName || 'DefaultDisplayName',
                    };
                }

                // Verifique se é um empate
                const isDraw = calculateWinner(board) === null && board.every(cell => cell !== null);

                // Calcule a pontuação com base no resultado da partida
                let updatedScore;
                if (isDraw) {
                    // Ganhe metade dos pontos em caso de empate
                    updatedScore = (userData?.score || 0) + (5 + scoreDelta);
                } else {
                    // Ganhe ou perca a pontuação total em caso de vitória ou derrota
                    updatedScore = (userData?.score || 0) + (10 + scoreDelta);
                }

                return {
                    ...userData,
                    score: isNaN(updatedScore) ? 0 : updatedScore,
                    wins: (userData?.wins || 0) + (isDraw ? 0 : 1), // Não conte uma vitória em caso de empate
                    displayName: user?.displayName || userData?.displayName || 'DefaultDisplayName',
                };
            });

            // Se a transação for bem-sucedida, atualize pointsSaved para true
            setPointsSaved(true);

            // Mensagem de depuração para indicar que a atualização foi bem-sucedida
            console.log('Atualização de pontos bem-sucedida!');
        } catch (error) {
            // Mensagem de depuração em caso de erro durante a atualização
            console.error('Erro ao salvar pontos:', error);
        }
    };

    const getCurrentPlayer = () => {
        if (winner) {
            return `${winner.name} (${winner.symbol}) wins!`;
        } else if (board.every(cell => cell !== null) && !winner) {
            return 'It\'s a draw!';
        } else {
            return isAgainstMachine ? (xIsNext ? 'Your turn (X)' : 'Machine is thinking...') : (xIsNext ? 'Player X' : 'Player O');
        }
    };

    return (
        <div>
            <h2>Tic Tac Toe</h2>
            <div className="board">
                {board.map((cell, index) => (
                    <div key={index} className="cell" onClick={() => handleClick(index)}>
                        {cell}
                    </div>
                ))}
            </div>
            <p>
                <strong>{getCurrentPlayer()}</strong>
            </p>
            <button onClick={handleToggleMode}>Toggle Mode (Against Machine)</button>

            {winner || (board.every(cell => cell !== null) && !winner) ? (
                winner ? (
                    winner.symbol === 'O' ? (
                        <p>IA ganhou. Pontos não salvos.</p>
                    ) : (
                        <button onClick={handleSavePoints} disabled={pointsSaved}>
                            {pointsSaved ? 'Points Saved' : 'Save Points'}
                        </button>
                    )
                ) : (
                    <div>
                        <p>Empate. Pontos não salvos.</p>
                        <button onClick={handleSavePoints} disabled={pointsSaved}>
                            {pointsSaved ? 'Points Saved' : 'Save Points'}
                        </button>
                    </div>
                )
            ) : null}
        </div>
    );
};

export default TicTacToe;
