import { getDatabase, ref, onValue, update as updateDatabase } from 'firebase/database';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import '../LikeDislike/LikeDislike.css'

const LikeDislike = ({ itemId, userId }) => {
    const db = getDatabase();
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userAction, setUserAction] = useState(null);
    const auth = useAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const itemRef = ref(db, `likeDislike/${itemId}`);

        onValue(itemRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setLikes(Math.max(data.likes || 0, 0));
                setDislikes(Math.max(data.dislikes || 0, 0));
                setUserAction(data.votes && data.votes[userId]);
            }
        });
    }, [db, itemId, userId]);

    const handleVote = useCallback((vote) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            // Exiba uma mensagem ou redirecione para a página de login
            console.log('Você precisa estar autenticado para votar.');
            // Aqui você pode adicionar a lógica para redirecionar para a página de login
            return;
        }

        const votesRef = ref(db, `likeDislike/${itemId}/votes`);
        const itemRef = ref(db, `likeDislike/${itemId}`);

        // Verifique se currentUser é nulo antes de acessar currentUser.uid
        if (currentUser.uid) {
            if (userAction === vote) {
                // Se o usuário clicou novamente no mesmo botão, remove o voto
                updateDatabase(votesRef, {
                    [userId]: null,
                });
                setUserAction(null);

                // Atualiza o número de likes e dislikes no nó do item
                updateDatabase(itemRef, {
                    likes: Math.max(0, vote === 'like' ? likes - 1 : likes),
                    dislikes: Math.max(0, vote === 'dislike' ? dislikes - 1 : dislikes),
                });
            } else {
                // Se o usuário está votando pela primeira vez ou mudando o voto, atualiza o voto
                updateDatabase(votesRef, {
                    [userId]: vote,
                });
                setUserAction(vote);

                // Atualiza o número de likes e dislikes no nó do item
                updateDatabase(itemRef, {
                    likes: Math.max(0, vote === 'like' ? likes + 1 : likes - (userAction === 'like' ? 1 : 0)),
                    dislikes: Math.max(0, vote === 'dislike' ? dislikes + 1 : dislikes - (userAction === 'dislike' ? 1 : 0)),
                });
            }
        } else {
            console.log('Usuário não autenticado.');
        }
    }, [auth, db, itemId, userId, userAction, likes, dislikes]);


    return (
        <div className='like-dislike-container'>
            <div>
                <button
                    id={`like-button-${itemId}`}
                    onClick={() => handleVote('like')}
                    disabled={!currentUser}
                >
                    <i className="bi bi-hand-thumbs-up-fill" id={userAction === 'like' ? 'like-button-active' : ''}></i> <span id={userAction === 'like' ? 'like-button-active' : ''}>({likes})</span>
                </button>
                <button
                    id={`dislike-button-${itemId}`}
                    onClick={() => handleVote('dislike')}
                    disabled={!currentUser}
                >
                    <i className="bi bi-hand-thumbs-down-fill" id={userAction === 'dislike' ? 'dislike-button-active' : ''}></i><span id={userAction === 'dislike' ? 'dislike-button-active' : ''}>({dislikes})</span>
                </button>
            </div>
            {!currentUser && <p>Você precisa estar autenticado para interagir.</p>}
        </div>
    );
};

export default LikeDislike;
