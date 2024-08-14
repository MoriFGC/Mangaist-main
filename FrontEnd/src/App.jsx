import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FirstPage from './pages/FirstPage';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';
import Nav from './components/Nav&Footer/Nav'
import Profile from './pages/Profile';
import AllManga from './pages/AllManga';
import AllPanels from './pages/AllPanels';
import SingleManga from './pages/SingleManga';
import SinglePanel from './pages/SinglePanel';
import AllUsers from './pages/AllUsers';




function App() {


  return (
    <Router>
      <Nav />
        <Routes>
          {/* TO DO SISTEMARE FIRSTPAGE */}
          <Route path="/" element={<FirstPage />} /> 
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/all-manga/:userId" element={<AllManga />} />
          <Route path="/all-panels" element={<AllPanels />} />
          <Route path="/manga/:id" element={<SingleManga />} />
          <Route path="/panel/:id" element={<SinglePanel />} />
          <Route path="/users" element={<AllUsers />} />
        </Routes>
    </Router>
  );
}

export default App;