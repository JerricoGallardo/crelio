import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TemplatesSection from './components/TemplatesSection';
import AboutSection from './components/AboutSection';
import FeedbackDisplay from './components/FeedbackDisplay';
import FeedbackForm from './components/FeedbackForm';
import Footer from './components/Footer';
import './styles.css';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'enabled'
  );
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.body.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''} ${compactMode ? 'compact-mode' : ''}`}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        compactMode={compactMode} 
        setCompactMode={setCompactMode} 
      />
      <div className="container">
        <main className="main-content">
          <Hero />
        </main>
      </div>
      <TemplatesSection />
      <AboutSection />
      <FeedbackDisplay />
      <FeedbackForm />
      <Footer />
    </div>
  );
}

export default App;
