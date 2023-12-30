// Navbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthentication } from '../../hooks/useAuthentication';
import { useAuthValue } from '../../context/AuthContext';
import '../Navbar/Navbar.css'

const Navbar = () => {
  const { logout } = useAuthentication();
  const { user } = useAuthValue();

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        <h1>Logo</h1>
      </NavLink>
      <ul className="links_list">
        <li>
          <NavLink to="/" className={isActive => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login" className={isActive => (isActive ? 'active' : '')}>
                Entrar
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={isActive => (isActive ? 'active' : '')}>
                Cadastrar
              </NavLink>
            </li>
          </>
        )}
        {user && (
          <>
            <li>
              <NavLink to="/new" className={isActive => (isActive ? 'active' : '')}>
                Novo Post
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={isActive => (isActive ? 'active' : '')}>
                Dashboard
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to="/about" className={isActive => (isActive ? 'active' : '')}>
            Sobre
          </NavLink>
        </li>
        {user && (
          <li>
            <button onClick={logout}>Sair</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
