import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

const RankingDraw = ({ userId }) => {
    const rankings = [
        { nome: 'S', dificuldade: 'Difícil', porcentagem: 5 },
        { nome: 'A', dificuldade: 'Moderado', porcentagem: 10 },
        { nome: 'B', dificuldade: 'Fácil', porcentagem: 15 },
        { nome: 'C', dificuldade: 'Muito Fácil', porcentagem: 20 },
        { nome: 'E', dificuldade: 'Extremamente Fácil', porcentagem: 25 },
    ];

    const totalTentativas = 3;
    const tempoPreSorteioSegundos = 10;

    const [resultado, setResultado] = useState(null);
    const [sorteioRealizado, setSorteioRealizado] = useState(false);
    const [tentativas, setTentativas] = useState(totalTentativas);
    const [rankingConfirmado, setRankingConfirmado] = useState(false);
    const [tempoPreSorteio, setTempoPreSorteio] = useState(tempoPreSorteioSegundos);

    useEffect(() => {
        let timerPreSorteio;

        if (!sorteioRealizado && tempoPreSorteio > 0) {
            timerPreSorteio = setInterval(() => {
                setTempoPreSorteio((prevTempo) => prevTempo - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timerPreSorteio);
        };
    }, [sorteioRealizado, tempoPreSorteio]);

    const sortear = () => {
        if (tentativas <= 0 || rankingConfirmado) {
            alert("Você já usou todas as tentativas ou já confirmou o ranking.");
            return;
        }

        const probabilidades = rankings.map((ranking) => ranking.porcentagem);
        const totalProbabilidades = probabilidades.reduce((acc, prob) => acc + prob, 0);
        const probabilidadeNormalizada = probabilidades.map((prob) => prob / totalProbabilidades);

        let sorteio = Math.random();
        let indiceSorteado = 0;

        for (let i = 0; i < probabilidadeNormalizada.length; i++) {
            sorteio -= probabilidadeNormalizada[i];

            if (sorteio <= 0) {
                indiceSorteado = i;
                break;
            }
        }

        const rankingSorteado = rankings[indiceSorteado];

        setResultado(rankingSorteado);
        setSorteioRealizado(true);
        setTentativas((prevTentativas) => prevTentativas - 1);
    };

    const confirmarRanking = async () => {
        if (resultado) {
            const database = getDatabase();
            const userRankingRef = ref(database, `users/${userId}/ranking`);

            try {
                await set(userRankingRef, resultado);
                console.log('Ranking confirmado e salvo no banco de dados.');
                setRankingConfirmado(true);
            } catch (error) {
                console.error('Erro ao salvar ranking:', error);
            }
        } else {
            alert('Você precisa sortear um ranking antes de confirmar.');
        }
    };

    return (
        <div>
            <h1>Descubra Seu Ranking</h1>
            {!sorteioRealizado && tempoPreSorteio > 0 && (
                <div>
                    <p>Contagem regressiva antes do sorteio: {tempoPreSorteio} segundos</p>
                </div>
            )}

            {!sorteioRealizado && tempoPreSorteio === 0 && (
                <div>
                    <button onClick={sortear}>
                        Iniciar Sorteio
                    </button>
                </div>
            )}

            {sorteioRealizado && (
                <div>
                    {resultado && (
                        <p>
                            Resultado: <strong>{resultado.nome}</strong> (Dificuldade: {resultado.dificuldade}, Porcentagem: {resultado.porcentagem}%)
                        </p>
                    )}
                    {tentativas < totalTentativas && (
                        <p>
                            Tentativas restantes: {tentativas}
                        </p>
                    )}
                    {resultado && !rankingConfirmado && (
                        <button onClick={confirmarRanking}>
                            Confirmar Ranking
                        </button>
                    )}
                    <button onClick={sortear} disabled={tentativas === 0 || rankingConfirmado}>
                        Sortear Novamente
                    </button>
                </div>
            )}
        </div>
    );
};

export default RankingDraw;
