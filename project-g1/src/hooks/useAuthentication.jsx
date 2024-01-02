import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile as updateProfileAuth,
    signOut,
} from "firebase/auth";

import { useState, useEffect, useRef } from "react";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const auth = getAuth();
    const isMounted = useRef(true);  // Referência mutável para verificar se o componente está montado

    const handleCancellation = () => {
        if (!isMounted.current) {
            throw new Error("Operação cancelada");
        }
    };

    const createUser = async (data) => {
        handleCancellation();

        setLoading(true);

        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfileAuth(user, { displayName: data.displayName });
            setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: data.displayName,
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
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
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
            });
        } catch (error) {
            let systemErrorMessage;

            if (error.message) {
                systemErrorMessage = "E-mail inválido ou Senha incorreta";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }

            setError(systemErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;  // O componente está montado

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            } : null);
        });

        return () => {
            isMounted.current = false;  // O componente está sendo desmontado
            unsubscribe();
        };
    }, [auth]);

    return {
        auth,
        createUser,
        error,
        logout,
        login,
        loading,
        currentUser,
        setCurrentUser,
    };
};
