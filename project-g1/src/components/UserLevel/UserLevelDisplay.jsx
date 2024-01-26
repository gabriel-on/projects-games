import { get, getDatabase, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';

const UserLevelDisplay = ({ userId }) => {
    const database = getDatabase();
    const [userLevel, setUserLevel] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    // Use o userId recebido como propriedade
                    const userLevelRef = ref(database, `usersLevel/${userId}/level`);
                    const userLevelSnapshot = await get(userLevelRef);

                    if (userLevelSnapshot.exists()) {
                        const level = userLevelSnapshot.val();
                        setUserLevel(level);

                        // Adicione logs para depuração
                        console.log('ID do Usuário:', userId);
                        console.log('Nível do Usuário:', level);
                    } else {
                        console.log('Nível do Usuário não encontrado. Definindo como 0.');
                        setUserLevel(0);
                    }
                } else {
                    console.log('ID do Usuário não fornecido. Definindo como 0.');
                    setUserLevel(0);
                }
            } catch (error) {
                console.error('Erro ao buscar nível do usuário:', error.message);
            }
        };

        fetchData();
    }, [database, userId]);

    return (
        <div>
            <p>Nível: {userLevel}</p>
        </div>
    );
};

export default UserLevelDisplay;