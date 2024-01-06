import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

// HOOKS
import { useAuth } from './hooks/useAuthentication.jsx';

// CONTEXT
import { AuthProvider } from './context/AuthContext.jsx';

// PAGINAS
import Home from './pages/Home/Home.jsx';
import About from './pages/About/About.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import AddGame from './pages/AddGame/AddGame.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import GameDetails from './pages/GameDetails/GameDetails.jsx';
import Footer from './components/Footer/Footer.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import EditGame from './components/EditGame/EditGame.jsx';
import DeleteGame from './components/DeleteSelectedGames/DeleteSelectedGames.jsx';
import GameList from './components/GameList/GameList.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';
import AllGames from './pages/AllGames/AllGames.jsx';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton.jsx';
import SearchBar from './pages/SearchBar/SearchBar.jsx';
import GenreList from './components/GenreList/GenreList.jsx';
import LatestAdded from './pages/LatestAdded/LatestAdded.jsx';
import GamesMoreInteractions from './components/PopularGamesList/PopularGamesList.jsx';
import JogoDaVelha from './components/JogoDaVelha/JogoDaVelha.jsx';
import Leaderboard from './components/Leaderboard/Leaderboard.jsx';

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuth();

  const loadingUser = user === undefined;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const database = getDatabase();
        const dbRef = ref(database, 'users/' + user.uid);

        try {
          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            const isAdmin = userData.isAdmin || false;
            setUser((prevUser) => ({ ...prevUser, isAdmin }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const isAdmin = user && user.isAdmin;

  console.log('isAdmin:', isAdmin);

  return (
    <div className='App'>
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <Navbar />
          <div className='container-absolute'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={!user ? <Login /> : <Navigate to={"/"} />} />
              <Route path='/register' element={!user ? <Register /> : <Navigate to={"/"} />} />
              <Route path='/about' element={<About />} />
              <Route path='/game/:gameId' element={<GameDetails />} />
              <Route path='/games' element={<GameList />} />

              <Route path='/profile' element={<UserProfile />} />

              <Route path='/search' element={<SearchBar />} />

              <Route path='/all-games' element={<AllGames />} />

              <Route path='/latest-added' element={<LatestAdded />} />

              <Route path='/populations' element={<GamesMoreInteractions />} />

              <Route path="/genres" element={<GenreList/>} />

              <Route path="/game-v" element={<JogoDaVelha/>} />

              <Route path="/leaderboard" element={<Leaderboard/>} />

              {isAdmin && (
                <>
                  <Route path='/new'
                    element={<AddGame />} />
                  <Route path="/dashboard"
                    element={<Dashboard />} />
                  <Route path="/admin"
                    element={<AdminPage />} />
                  <Route path='/edit/:gameId'
                    element={<EditGame />} />
                  <Route path='/delete/:gameId'
                    element={<DeleteGame />} />
                </>
              )}
            </Routes>
          </div>
          <ScrollToTopButton />
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
