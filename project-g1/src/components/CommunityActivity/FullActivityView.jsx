import React, { useState } from 'react';
import { ref, push, set, getDatabase } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';

function FullActivityView({ activity }) {
    const auth = useAuth();
    const db = getDatabase();
    const currentUser = auth.currentUser;
    const [newResponseText, setNewResponseText] = useState('');

    const handlePostResponse = async () => {
        if (newResponseText.trim() === '' || !currentUser || !currentUser.uid || !currentUser.displayName || !activity) {
            console.error('Usuário não autenticado, informações ausentes ou nenhuma atividade selecionada.');
            return;
        }

        try {
            const activityRef = ref(db, `communityActivities/${activity.id}/responses`);
            const newResponseRef = push(activityRef);

            const responseInfo = {
                id: newResponseRef.key,
                text: newResponseText,
                userId: currentUser.uid,
                displayName: currentUser.displayName,
            };

            await set(newResponseRef, responseInfo);

            setNewResponseText('');
        } catch (error) {
            console.error('Erro ao postar resposta:', error.message);
            // Lógica de tratamento de erro, se necessário
        }
        console.log('Respostas:', activity.responses);
    };

    return (
        <div>
            <h3>Atividade Completa</h3>
            <p>{activity.text}</p>
            {activity && (
                <div>
                    <h4>Respostas</h4>
                    <ul>
                        {activity && activity.responses && Object.values(activity.responses).map((response) => (
                            <li key={response.id}>
                                <p>
                                    {response.displayName}: <span>
                                        {response.text}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newResponseText}
                        onChange={(e) => setNewResponseText(e.target.value)}
                    />
                    <button onClick={handlePostResponse}>
                        Postar Resposta
                    </button>
                </div>
            )}
        </div>
    );
}

export default FullActivityView;