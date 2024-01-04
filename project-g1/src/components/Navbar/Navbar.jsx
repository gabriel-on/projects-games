import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import { useAuthValue } from '../../context/AuthContext';
import '../Navbar/Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const { user } = useAuthValue();

  const isAdmin = user && user.isAdmin;

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
        <li>
          <NavLink to="/search">
            Buscar
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
            <NavLink to="/" onClick={logout}>
              Sair
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
