import React from 'react';
import { useQuiz } from './context/QuizContext';
import { QuizSetup } from './components/QuizSetup';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';

const AppContent: React.FC = () => {
  const { config, isFinished } = useQuiz();

  if (!config) {
    return <QuizSetup />;
  }

  if (isFinished) {
    return <ResultsScreen />;
  }

  return <QuizScreen />;
};

function App() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '20px 24px', 
        backgroundColor: 'var(--bg-card)', 
        borderBottom: '1px solid var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ color: 'var(--accent-primary)', margin: 0, fontSize: '1.5rem', letterSpacing: '0.5px' }}>
          CCNA Prep
        </h2>
      </header>
      
      <main style={{ flex: 1, padding: '24px' }}>
        <AppContent />
      </main>
    </div>
  );
}

export default App;
