import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FirstPage from './pages/FirstPage';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';
import Nav from './components/Nav&Footer/Nav'
import Profile from './pages/Profile';
import SingleManga from './pages/SingleManga';
import SinglePanel from './pages/SinglePanel';
import AllUsers from './pages/AllUsers';
import Library from './pages/Library';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Nav>
        {({ updateUserData }) => (
          <Routes>
            <Route path="/" element={<FirstPage />} /> 
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile/:id" element={<Profile updateUserData={updateUserData} />} />
            <Route path="/manga/:id" element={<SingleManga />} />
            <Route path="/panel/:id" element={<SinglePanel />} />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/library" element={<Library />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        )}
      </Nav>
    </Router>
  );
}

export default App;