import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';

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
import FirstVisitAchievement from './components/Achievements/FirstVisitAchievement.jsx';
import RankingDraw from './components/RankingDraw/RankingDraw.jsx';
import Members from './pages/Members/Members.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx';
import CommunityActivity from './components/CommunityActivity/CommunityActivity.jsx';
import FullActivityView from './components/CommunityActivity/FullActivityView.jsx';
import ActivityDetails from './components/CommunityActivity/ActivityDetails.jsx';
import AchievementsList from './components/AchievementsList/AchievementsList.jsx';
import Achievement from './components/Achievements/Achievement.jsx';
import AdvancedSearch from './components/AdvancedSearch/AdvancedSearch.jsx';

function App() {
  const [user, setUser] = useState(undefined);
  const [userLevel, setUserLevel] = useState(1);
  const { auth } = useAuth();
  const [isDarkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('darkMode')) || false;
  });
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const simulateLoading = async () => {
      try {
        // Simule um carregamento para demonstração
        for (let i = 0; i <= 100; i += 25) {
          setLoadingProgress(i);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error during loading:', error);
      }
    };

    simulateLoading();

    // Cleanup function (optional)
    return () => {
      // Additional cleanup logic if needed
    };
  }, []);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const body = document.body;
    body.classList.toggle('dark-mode', isDarkMode);

    // Salva o estado do tema no localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

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
          } else {
            // Desbloqueie a conquista de primeiro acesso
            const achievementsRef = ref(database, 'userAchievements/' + user.uid);
            await set(achievementsRef, {
              firstVisitAchievement: true,
              // Outras conquistas podem ser adicionadas aqui
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const isAdmin = user && user.isAdmin;
  const userId = user ? user.uid : null;

  console.log('isAdmin:', isAdmin);

  const rankings = ['S', 'A', 'B', 'C', 'D', 'E'];

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <ThemeProvider value={{ isDarkMode, toggleTheme }}>
        <AuthProvider value={{ user }}>
          <BrowserRouter>
            <FirstVisitAchievement userId={user && user.uid} firstVisitAchievementId="firstVisitAchievementId" />
            <Navbar userId={userId} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

            <ProgressBar />
            <div className="container-absolute">
              {loading ? (
                <LoadingScreen loadingProgress={loadingProgress} />
              ) : (
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/login' element={!user ? <Login /> : <Navigate to={`/profile/${userId}`} />} />
                  <Route path='/register' element={!user ? <Register /> : <Navigate to={"/"} />} />
                  <Route path='/about' element={<About />} />
                  <Route path='/game/:gameId' element={<GameDetails />} />
                  <Route path='/games' element={<GameList />} />

                  <Route path='/profile/:userId' element={<UserProfile />} />

                  <Route path='/members' element={<Members />} />

                  <Route path='/achievements' element={<AchievementsList />} />
                  <Route path='/achievement/:achievementId' element={<Achievement />} />

                  <Route path='/search' element={<SearchBar />} />

                  <Route path='/advanced-search' element={<AdvancedSearch/>}/>

                  <Route path='/all-games' element={<AllGames />} />

                  <Route path='/rank' element={<RankingDraw rankings={rankings} userId={userId} />} />

                  <Route path='/latest-added' element={<LatestAdded />} />

                  <Route path='/populations' element={<GamesMoreInteractions />} />

                  <Route path='/community' element={<CommunityActivity />} />
                  <Route path='/activity/:activityId' element={<ActivityDetails />} />

                  <Route path="/genres" element={<GenreList />} />

                  <Route path="/game-v" element={<JogoDaVelha />} />

                  <Route path="/leaderboard" element={<Leaderboard userLevel={userLevel} />} />

                  {isAdmin && (
                    <>
                      <Route path='/new'
                        element={<AddGame />} />
                      <Route path="/dashboard"
                        element={<Dashboard />} />
                      <Route path="/admin"
                        element={<AdminPage isAdmin={isAdmin} />} />
                      <Route path='/edit/:gameId'
                        element={<EditGame />} />
                      <Route path='/delete/:gameId'
                        element={<DeleteGame />} />
                    </>
                  )}
                </Routes>
              )}
            </div>
            <ScrollToTopButton />
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </div >
  );
}

export default App;