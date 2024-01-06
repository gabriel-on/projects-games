import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { ref, getDatabase, runTransaction } from 'firebase/database';
import '../JogoDaVelha/JogoDaVelha.css';

const JogoDaVelha = () => {
    const { user } = useAuth();
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [isAgainstMachine, setIsAgainstMachine] = useState(false);
    const [pointsSaved, setPointsSaved] = useState(false);
    const { getCurrentUser } = useAuth();
    const [playAgain, setPlayAgain] = useState(false);

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
                    await updateScoresInRealtimeDatabase(currentUser.uid, 'usersScore', 0);
                    setPointsSaved(true);
                    console.log('Atualização de pontos bem-sucedida!');
                } catch (error) {
                    console.error('Erro ao salvar pontos:', error);
                }
            } else {
                console.warn('Usuário não autenticado ou não possui um UID. Não é possível salvar pontos.');
            }
        } else {
            console.warn('Os pontos já foram salvos anteriormente.');
        }
    };

    const handleToggleMode = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setXIsNext(true);
        setIsAgainstMachine(!isAgainstMachine);
        setPointsSaved(false);
        setPlayAgain(false);

        if (isAgainstMachine && !xIsNext) {
            makeMachineMoveWithDelay();
        }
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

    const makeMachineMove = () => {
        const emptyCells = board.reduce((acc, cell, i) => (cell === null ? [...acc, i] : acc), []);
        const bestMove = minimax(board, 'O').index;
        if (emptyCells.includes(bestMove)) {
            if (!calculateWinner(board)) {
                const newBoard = board.slice();
                newBoard[bestMove] = 'O';
                setBoard(newBoard);
                setXIsNext(true);
            }
        }
    };

    const makeMachineMoveWithDelay = () => {
        setTimeout(() => {
            makeMachineMove();
        }, 1000);
    };

    const minimax = (currentBoard, player) => {
        const emptyCells = currentBoard.reduce((acc, cell, i) => (cell === null ? [...acc, i] : acc), []);
        if (calculateWinner(currentBoard) === 'X') {
            return { score: -1 };
        } else if (calculateWinner(currentBoard) === 'O') {
            return { score: 1 };
        } else if (emptyCells.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < emptyCells.length; i++) {
            const move = {};
            move.index = emptyCells[i];
            currentBoard[emptyCells[i]] = player;

            if (player === 'O') {
                const result = minimax(currentBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(currentBoard, 'O');
                move.score = result.score;
            }

            currentBoard[emptyCells[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    };

    useEffect(() => {
        const handleWinner = () => {
            const winnerPlayer = calculateWinner(board);
            if (winnerPlayer && !winner) {
                let scoreDelta = 10;
                let winnerName = 'Unknown User';

                if (user && winnerPlayer === 'X') {
                    winnerName = user.displayName || winnerName;
                }

                setWinner((prevWinner) => ({
                    name: winnerName,
                    symbol: winnerPlayer,
                }));

                if (user && user.uid && winnerPlayer === 'X') {
                    updateScoresInRealtimeDatabase(user.uid, 'usersScore', scoreDelta);
                }

                setPlayAgain(true);
            }
        };

        handleWinner();

        if (winner || (board.every(cell => cell !== null) && !winner)) {
            if (user) {
                let scoreDelta = 0;

                if (calculateWinner(board) === 'O') {
                    scoreDelta = -5;
                }

                updateScoresInRealtimeDatabase(user.uid, 'usersScore', scoreDelta);
            }
        }

        if (isAgainstMachine && !xIsNext) {
            makeMachineMoveWithDelay();
        }
    }, [board, isAgainstMachine, winner, user]);

    const updateScoresInRealtimeDatabase = async (userId, node, scoreDelta) => {
        const db = getDatabase();
        const userRef = ref(db, `${node}/${userId}/0`);

        try {
            await runTransaction(userRef, (userData) => {
                if (!userData) {
                    return {
                        score: 10 + scoreDelta,
                        wins: 1,
                        displayName: user?.displayName || 'DefaultDisplayName',
                    };
                }

                const isDraw = calculateWinner(board) === null && board.every(cell => cell !== null);

                let updatedScore;
                if (isDraw) {
                    updatedScore = (userData?.score || 0) + (5 + scoreDelta);
                } else {
                    updatedScore = (userData?.score || 0) + (10 + scoreDelta);
                }

                return {
                    ...userData,
                    score: isNaN(updatedScore) ? 0 : updatedScore,
                    wins: (userData?.wins || 0) + (isDraw ? 0 : 1),
                    displayName: user?.displayName || userData?.displayName || 'DefaultDisplayName',
                };
            });

            setPointsSaved(true);
            console.log('Atualização de pontos bem-sucedida!');
        } catch (error) {
            console.error('Erro ao salvar pontos:', error);
        }
    };

    const getCurrentPlayer = () => {
        if (winner) {
            return `${winner.name} (${winner.symbol}) wins!`;
        } else if (board.every(cell => cell !== null) && !winner) {
            return 'It\'s a draw!';
        } else {
            return isAgainstMachine ? (xIsNext ? 'SUA VEZ (X)' : 'Machine is thinking...') : (xIsNext ? 'Player X' : 'Player O');
        }
    };

    const handlePlayAgain = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setXIsNext(true);
        setPointsSaved(false);
        setPlayAgain(false);

        if (isAgainstMachine && !xIsNext) {
            makeMachineMoveWithDelay();
        }
    };

    return (
        <div>
            <h2>Jogo da Velha</h2>
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
            {!isAgainstMachine && (
                <button onClick={handleToggleMode} disabled={playAgain}>
                    Jogar contra a Maquina (Against Machine)
                </button>
            )}

            {playAgain && (
                <button onClick={handlePlayAgain}>
                    Jogar Novamente
                </button>
            )}

            {winner || (board.every(cell => cell !== null) && !winner) ? (
                winner ? (
                    winner.symbol === 'O' ? (
                        <p>IA ganhou. Pontos não salvos.</p>
                    ) : (
                        <div>
                            <p>{winner.name} ({winner.symbol}) ganhou. Pontos não salvos.</p>
                            <button onClick={handleSavePoints} disabled={pointsSaved}>
                                {pointsSaved ? 'Pontos Salvos' : 'Salvar Pontos'}
                            </button>
                            <button onClick={() => setPlayAgain(true)}>
                                Jogar Novamente
                            </button>
                        </div>
                    )
                ) : (
                    <div>
                        <p>Empate. Pontos não salvos.</p>
                        <button onClick={handleSavePoints} disabled={pointsSaved}>
                            {pointsSaved ? 'Pontos Salvos' : 'Salvar Pontos'}
                        </button>
                        <button onClick={() => setPlayAgain(true)}>
                            Jogar Novamente
                        </button>
                    </div>
                )
            ) : null}
        </div>
    );
};

export default JogoDaVelha;
