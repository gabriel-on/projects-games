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

            await updateProfile(user, {
                displayName: data.displayName,
            });
            setLoading(false);

            return user;
        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);

            let systemErrorMessage;

            if (error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
            }

            setLoading(false);

            setError(systemErrorMessage);
        }

    };

    // LOGOUT - SAIR
    const logout = () => {
        checkIfIsCancelled();

        signOut(auth);
    };

    // LOGIN - ENTRAR
    const login = async (data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError(false);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);

        } catch (error) {
            let systemErrorMessage;

            if (error.message) {
                systemErrorMessage = "E-mail invalido ou Senha incorreta"
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde."
            }

            setError(systemErrorMessage);
        } finally {
            setLoading(false);
        }

        // console.log(error);

        // setLoading(false);
    };

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    // Obter informações sobre o usuário atual
    const getCurrentUser = () => {
        const user = auth.currentUser;
        return user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null;
    };

    return {
        auth,
        createUser,
        error,
        logout,
        login,
        loading,
        getCurrentUser,
    };
};