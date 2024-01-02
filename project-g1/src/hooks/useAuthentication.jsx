import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    // REGISTER
    const createUser = async (data) => {
        checkIfIsCancelled();

        setLoading(true);

        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfile(user, { displayName: data.displayName });
            setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: data.displayName,
            });

            setLoading(false);

            return user;
        } catch (error) {
            let systemErrorMessage;

            if (error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }

            setLoading(false);

            setError(systemErrorMessage);
        }
    };

    // LOGOUT - SAIR
    const logout = () => {
        checkIfIsCancelled();

        signOut(auth);
        setCurrentUser(null);
    };

    // LOGIN - ENTRAR
    const login = async (data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError(false);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);

            const user = auth.currentUser;
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
    }, [auth]);

    return {
        auth,
        createUser,
        error,
        logout,
        login,
        loading,
        currentUser,
    };
};