import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'
import { db } from './firebase/firebase.js'
import { useState, useEffect } from 'react'

// HOOKS
import { useAuthentication } from './hooks/useAuthentication.jsx'

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
// import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx'

// COMPONENTES
import Footer from './components/Footer/Footer.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Search from './pages/Search/Search.jsx'
// import Pagination from './components/Pagination/Pagination'
import EditGame from './components/EditGame/EditGame.jsx'
import DeleteGame from './components/DeleteSelectedGames/DeleteSelectedGames.jsx'
import GameList from './components/GameList/GameList.jsx'

function App() {

  const [user, setUser] = useState(undefined)
  const { auth } = useAuthentication()

  const loadingUser = user === undefined

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
  }, [auth])

  if (loadingUser) {
    return <p>Carregando...</p>
  }
  return (
    <div className='App'>
      <AuthProvider value={{user}}>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={!user ? <Login /> : <Navigate to={"/"} />} />
              <Route path='/register' element={!user ? <Register /> : <Navigate to={"/"} />} />
              <Route path='/about' element={<About />} />
              <Route path='/new' element={user ? <AddGame /> : <Navigate to={"/login"} />} />
              <Route path='/game/:gameId' element={<GameDetails />} />
              <Route path='/games' element={<GameList />} />
              <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to={"/login"} />} />
              <Route path='/edit/:gameId' element={<EditGame />} />
              <Route path='/delete/:gameId' element={<DeleteGame />} />
            </Routes>

          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App