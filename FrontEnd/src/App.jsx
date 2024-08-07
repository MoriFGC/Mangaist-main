import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FirstPage from './pages/FirstPage';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';
import Nav from './components/Nav&Footer/Nav'




function App() {


  return (
    <Router>
      <Nav />
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/home" element={<Home />} />
        </Routes>
    </Router>
  );
}

export default App;