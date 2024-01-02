import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { db } from '../../firebase/firebase';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, error: authError, loading, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const userCredentials = {
      email,
      password,
    };

    const res = await login(userCredentials);

    if (res && res.user) {
      const userRef = db.collection('users').doc(res.user.uid);

      try {
        // Verificar se o usuário tem a função de administrador
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          // Redirecionar para a página de dashboard se o usuário for um administrador
          if (userData.role === 'admin') {
            return <Navigate to="/dashboard" />;
          }
        }

        // Se o usuário não for um administrador, você pode fazer outras verificações ou redirecionar para outra página

        console.log('Login bem-sucedido:', res.user);
      } catch (error) {
        console.error('Erro ao verificar função de administrador:', error);
        setError('Erro ao fazer login. Tente novamente mais tarde.');
      }
    }
  };

  useEffect(() => {
    console.log(authError);
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="login">
      <h1>Entrar</h1>
      <p>Faça o login para poder utilizar o sistema</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail:</span>
          <input type="email" name="email" required placeholder="E-mail do usuário" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Senha:</span>
          <input type="password" name="password" required placeholder="Sua senha" onChange={(e) => setPassword(e.target.value)} />
        </label>
        {!loading && <button className="btn">Entrar</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
      <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link>.</p>
    </div>
  );
};

export default Login;
