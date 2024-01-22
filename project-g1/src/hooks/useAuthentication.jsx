import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile as updateProfileAuth,
    signOut,
} from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { getDatabase, ref, set } from "firebase/database"; // Importação do Realtime Database
import { getUnixTime } from 'date-fns';

export const useAuth = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const auth = getAuth();
    const db = getDatabase(); // Inicialização do Realtime Database
    const isMounted = useRef(true);

    const handleCancellation = () => {
        if (!isMounted.current) {
            throw new Error("Operação cancelada");
        }
    };

    const createUser = async (data) => {
        handleCancellation();
        setLoading(true);
        
        try {

            data.isAdmin = 
            data.email === 'black@gmail.com' || 
            data.email === 'black2@gmail.com' ||
            data.email === 'black3@gmail.com';


            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfileAuth(user, { displayName: data.displayName });

            const joinedAt = getUnixTime(new Date()); // Obtém o timestamp UNIX atual

            // Criar um documento para o usuário no Realtime Database
            const dbRef = ref(db, `users/${user.uid}`);
            await set(dbRef, {
                email: data.email,
                displayName: data.displayName,
                isAdmin: data.isAdmin || false,
                joinedAt: joinedAt,
            });

            setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: data.displayName,
                isAdmin: data.isAdmin || false,
            });

            setLoading(false);

            return user;
        } catch (error) {
            let systemErrorMessage;

            if (error.code === "auth/weak-password") {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.code === "auth/email-already-in-use") {
                systemErrorMessage = "E-mail já cadastrado.";
            } else {
                systemErrorMessage =
                    "Ocorreu um erro, por favor tente mais tarde.";
            }

            setLoading(false);

            setError(systemErrorMessage);
        }
    };

    const logout = async () => {
        handleCancellation();
        setLoading(true);

        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (error) {
            console.error("Erro ao fazer logout:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {
        handleCancellation();
        setLoading(true);
        setError(false);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);

            const user = auth.currentUser;

            await updateProfileAuth(user, { displayName: user.displayName });

            setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                isAdmin: data.isAdmin || false,
            });
        } catch (error) {
            let systemErrorMessage;

            if (error.message) {
                systemErrorMessage = "E-mail inválido ou Senha incorreta";
            } else {
                systemErrorMessage =
                    "Ocorreu um erro, por favor tente mais tarde.";
            }

            setError(systemErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(
                user
                    ? {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                    }
                    : null
            );
        });

        return () => {
            isMounted.current = false;
            unsubscribe();
        };
    }, [auth]);

    const getCurrentUser = () => {
        return auth.currentUser;
    };

    return {
        auth,
        createUser,
        error,
        logout,
        login,
        loading,
        currentUser,
        setCurrentUser,
        getCurrentUser
    };
};  