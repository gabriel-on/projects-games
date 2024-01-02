// useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

// Inicialize o Firebase com a sua configuração
const firebaseConfig = {
  // Sua configuração do Firebase aqui
};

firebase.initializeApp(firebaseConfig);

// Crie um contexto para o usuário autenticado
const AuthContext = createContext();

// Hook para fornecer acesso ao contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Componente provedor de contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Efeito para observar as mudanças de autenticação
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Limpe o efeito ao desmontar o componente
    return () => unsubscribe();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Fornecer o contexto com os dados e funções necessárias
  const contextValue = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
