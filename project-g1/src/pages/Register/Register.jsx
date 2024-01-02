import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { createUser, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    const userCredentials = {
      displayName,
      email,
      password,
    };

    try {
      // Chame a função createUser fornecida pelo seu hook useAuthentication
      const res = await createUser(userCredentials);

      // Check if the user creation was successful before trying to set the user role
      if (res && res.user) {
        // Adicione o usuário ao Firestore
        const firestore = getFirestore();
        const userRef = collection(firestore, 'users');

        // Adicione um novo documento para o usuário com o ID gerado automaticamente
        await addDoc(userRef, {
          uid: res.user.uid,
          displayName,
          email,
          role: 'user',  // Define o papel como 'user' por padrão
          // outros campos do usuário
        });
      }

      console.log(res);
    } catch (error) {
      setError('Erro ao criar o usuário: ' + error.message);
    }
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="register">
      <h1>Cadastre-se para postar</h1>
      <p>Crie seu usuário</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input type="text" name="displayName" required placeholder="Nome do usuário" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label>
          <span>E-mail:</span>
          <input type="email" name="email" required placeholder="E-mail do usuário" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Senha:</span>
          <input type="password" name="password" required placeholder="Insira sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          <span>Confirmação de senha:</span>
          <input type="password" name="confirmPassword" required placeholder="Confirme a sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </label>
        {!loading && <button className="btn">Cadastrar</button>}
        {loading && <button className="btn" disabled>Aguarde...</button>}
        {error && <p className="error">{error}</p>}
      </form>
      <p>Já tem uma conta? <Link to="/login">Faça o login</Link>.</p>
    </div>
  );
};

export default Register;
