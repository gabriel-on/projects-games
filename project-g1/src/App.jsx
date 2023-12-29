import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { db } from './firebase/firebase.js'

// HOOKS
import { useState, useEffect } from 'react'
import { useAuthentication } from './hooks/useAuthentication'


// CONTEXT
import { AuthProvider } from './context/AuthContext.jsx'

// PAGINAS
import Home from './pages/Home/Home.jsx'
import About from './pages/About/About.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import AddGame from './pages/AddGame/AddGame.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import GameDetails from './pages/GameDetails/GameDetails.jsx'

// COMPONENTES
import Footer from './components/Footer/Footer.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Search from './pages/Search/Search.jsx'
// import Pagination from './components/Pagination/Pagination'

function App() {

  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Routes>
              <Route
                path='/'
                element={<Home />} />
              <Route
                path='/about'
                element={<About />} />
              <Route
                path='/new'
                element={<AddGame />} />
              <Route
                path='/game/:gameId'
                element={<GameDetails />} />
              <Route
                path='/dashboard'
                element={<Dashboard />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App