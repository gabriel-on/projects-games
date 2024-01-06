import React, { useState, useEffect } from 'react';
import { ref, runTransaction, getDatabase, set } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import '../JogoDaVelha/JogoDaVelha.css'

const TicTacToe = () => {
    const { user } = useAuth();
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [isAgainstMachine, setIsAgainstMachine] = useState(false);

    useEffect(() => {
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

        const handleWinner = async () => {
            const winnerPlayer = calculateWinner(board);

            if (winnerPlayer) {
                setWinner((prevWinner) => ({
                    name: user?.displayName || (prevWinner?.name) || 'Unknown User',
                    symbol: winnerPlayer,
                }));

                // Adiciona pontos ao vencedor apenas para usuários autenticados
                if (user) {
                    const userId = user.uid;
                    const db = getDatabase();
                    const userRef = ref(db, `users/${userId}`);

                    await runTransaction(userRef, async (userData) => {
                        if (!userData) {
                            // Se o nó do usuário não existir, crie-o com uma pontuação inicial
                            set(userRef, { score: 10, wins: 1, displayName: user.displayName });
                            return { score: 10, wins: 1, displayName: user.displayName };
                        }

                        // Certifique-se de que estamos atualizando o campo 'score'
                        userData.score = (parseInt(userData.score, 10) || 0) + 10;

                        // Adiciona uma contagem de vitórias
                        userData.wins = (userData.wins || 0) + 1;

                        // Atualiza o nome do vencedor apenas se não estiver definido no banco de dados
                        if (!userData.displayName) {
                            userData.displayName = user.displayName;
                        }

                        return userData;
                    }, (error, committed, snapshot) => {
                        if (error) {
                            console.error('Transação falhou:', error);
                        }
                    });
                }
            }
        };

        handleWinner();
    }, [board, user]);

    const handleClick = (index) => {
        if (!board[index] && !winner && (isAgainstMachine || (xIsNext && !isAgainstMachine))) {
            const newBoard = board.slice();
            newBoard[index] = xIsNext ? 'X' : 'O';
            setBoard(newBoard);
            setXIsNext(!xIsNext);

            if (isAgainstMachine) {
                // Simples IA: escolhe aleatoriamente uma célula vazia
                const emptyCells = newBoard.reduce((acc, cell, i) => (cell === null ? [...acc, i] : acc), []);
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const machineMove = emptyCells[randomIndex];

                setTimeout(() => {
                    newBoard[machineMove] = 'O';
                    setBoard(newBoard);
                    setXIsNext(true);
                }, 500);
            }
        }
    };

    const handleToggleMode = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setXIsNext(true);
        setIsAgainstMachine(!isAgainstMachine);
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
                {winner && (
                    <strong>
                        {winner.name} with {winner.symbol} is the winner!
                    </strong>
                )}
                {!winner && !board.includes(null) && <strong>It's a draw!</strong>}
            </p>
            <button onClick={handleToggleMode}>Toggle Mode (Against Machine)</button>
        </div>
    );
};

export default TicTacToe;