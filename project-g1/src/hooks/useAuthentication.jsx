import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile as updateProfileAuth,
    signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth();

    const handleCancellation = () => {
        if (cancelled) {
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

    const logout = () => {
        handleCancellation();

        signOut(auth);
        setCurrentUser(null);
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
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            } : null);
        });

        return () => {
            unsubscribe();
            setCancelled(true);
        };
    }, [auth, cancelled]);

    return {
        auth,
        createUser,
        error,
        logout,
        login,
        loading,
        currentUser,
        setCurrentUser, // Adicione a função setCurrentUser ao retorno do hook
    };
};