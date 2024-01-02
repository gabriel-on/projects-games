// Navbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import { useAuthValue } from '../../context/AuthContext';
import '../Navbar/Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const { user } = useAuthValue();

  const isAdmin = user && user.isAdmin;

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
            <li >
              <NavLink to="/login" className={isActive => (isActive ? 'active' : '')}>
                Entrar
              </NavLink>
            </li>
            <li >
              <NavLink to="/register" className={isActive => (isActive ? 'active' : '')}>
                Cadastrar
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
          <>
          <li>
              <NavLink to="/profile" className={isActive => (isActive ? 'active' : '')}>
                Perfil
              </NavLink>
            </li>
            <li className='md-dash-admin'>
              {isAdmin && (
                <NavLink to="/dashboard" className={isActive => (isActive ? 'active' : '')}>
                  Dashboard
                </NavLink>
              )}
            </li>
            <li className='md-dash-admin'>
              {isAdmin && (
                <NavLink to="/admin" className={isActive => (isActive ? 'active' : '')}>
                  Admin
                </NavLink>
              )}
            </li>
          </>
        )}
        {user && (
          <li>
            <NavLink to="/">
              <button onClick={logout}>Sair</button>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
