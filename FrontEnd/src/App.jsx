import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0ProviderWithHistory } from './components/Auth0ProviderWithHistory';
import Home from './pages/Home';
import HelloWorld from './pages/HelloWorld';

function App() {
  return (
    <Router>
      <Auth0ProviderWithHistory>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hello" element={<HelloWorld />} />
        </Routes>
      </Auth0ProviderWithHistory>
    </Router>
  );
}

export default App;