import { getDatabase, ref, onValue, update as updateDatabase } from 'firebase/database';
import { useEffect, useState, useCallback } from 'react';

const LikeDislike = ({ itemId, userId }) => {
    const db = getDatabase();
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userAction, setUserAction] = useState(null);

    useEffect(() => {
        // Adicione a lógica para buscar os dados iniciais do Firebase
        const itemRef = ref(db, `likeDislike/${itemId}`);

        onValue(itemRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setLikes(data.likes || 0);
                setDislikes(data.dislikes || 0);
            }
        });
    }, [db, itemId]);

    const handleLike = useCallback(() => {
        // Adicione a lógica para lidar com o like
        if (userAction === 'Like') {
            // Se o usuário já deu like, pode remover o like aqui
            updateDatabase(ref(db, `likeDislike/${itemId}`), {
                likes: likes - 1,
            });
            setUserAction(null);
        } else {
            // Se o usuário não deu like ainda, pode adicionar o like aqui
            updateDatabase(ref(db, `likeDislike/${itemId}`), {
                likes: likes + 1,
                dislikes: userAction === 'Dislike' ? dislikes - 1 : dislikes,
            });
            setUserAction('Like');
        }
    }, [db, itemId, likes, dislikes, userAction]);

    const handleDislike = useCallback(() => {
        // Adicione a lógica para lidar com o dislike
        if (userAction === 'Dislike') {
            // Se o usuário já deu dislike, pode remover o dislike aqui
            updateDatabase(ref(db, `likeDislike/${itemId}`), {
                dislikes: dislikes - 1,
            });
            setUserAction(null);
        } else {
            // Se o usuário não deu dislike ainda, pode adicionar o dislike aqui
            updateDatabase(ref(db, `likeDislike/${itemId}`), {
                dislikes: dislikes + 1,
                likes: userAction === 'Like' ? likes - 1 : likes,
            });
            setUserAction('Dislike');
        }
    }, [db, itemId, likes, dislikes, userAction]);

    return (
        <div>
            <button id={`like-button-${itemId}`} onClick={handleLike}>
                {userAction === 'Like' && '✔️'} 👍 ({likes})
            </button>
            <button id={`dislike-button-${itemId}`} onClick={handleDislike}>
                {userAction === 'Dislike' && '✔️'} 👎 ({dislikes})
            </button>
        </div>
    );
};

export default LikeDislike;