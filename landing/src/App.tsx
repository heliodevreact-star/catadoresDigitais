import './index.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Vagas } from './pages/Vagas';
import { Design } from './pages/Design';
import { OficinaLetramento } from './pages/OficinaLetramento';
import { OficinaLetramentoJogo } from './pages/OficinaLetramentoJogo';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<main><Home /></main>} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/design" element={<Design />} />
          <Route path="/oficinaletramento" element={<OficinaLetramento />} />
          <Route path="/oficinaletramento/jogo" element={<OficinaLetramentoJogo />} />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
