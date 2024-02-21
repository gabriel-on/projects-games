import { ref, getDatabase, get } from 'firebase/database';
import { useEffect, useState } from 'react';

const GameStatusDisplay = ({ gameId }) => {
    const [userStatus, setUserStatus] = useState({});

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const database = getDatabase();
                const statusRef = ref(database, `games/${gameId}/userStatus`);
                const statusSnapshot = await get(statusRef);

                console.log('statusSnapshot:', statusSnapshot.val()); // Adicione este log

                if (statusSnapshot.exists()) {
                    const statusData = statusSnapshot.val();
                    setUserStatus(statusData);
                } else {
                    setUserStatus({});
                }
            } catch (error) {
                console.error('Erro ao obter status do usuário:', error);
            }
        };

        fetchUserStatus();
    }, [gameId]);

    return (
        <div>
            <h2>Status do Jogo</h2>

            {Object.keys(userStatus).length > 0 ? (
                Object.entries(userStatus).map(([userId, status]) => (
                    <p key={userId}>
                        ID do Usuário: {userId}, Status: {status}
                    </p>
                ))
            ) : (
                <p>Nenhum status encontrado.</p>
            )}

            {/* Restante do código para exibir outros detalhes */}
        </div>
    );
};

export default GameStatusDisplay;
