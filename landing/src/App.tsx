import './index.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PasswordGate } from './components/PasswordGate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Vagas } from './pages/Vagas';
import { Design } from './pages/Design';

function App() {
  return (
    <ThemeProvider>
      <PasswordGate>
        <div className="min-h-screen overflow-x-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={<main><Home /></main>} />
            <Route path="/vagas" element={<Vagas />} />
            <Route path="/design" element={<Design />} />
          </Routes>
          <Footer />
        </div>
      </PasswordGate>
    </ThemeProvider>
  );
}

export default App;
