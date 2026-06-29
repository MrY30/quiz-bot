import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { CheckCircle2, RotateCcw, Settings } from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const { score, questions, restartQuiz, resetSetup } = useQuiz();
  
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  
  let message = "Keep studying, you can do better!";
  if (percentage >= 90) message = "Excellent work!";
  else if (percentage >= 75) message = "Great job!";
  else if (percentage >= 60) message = "Good effort, but needs review.";

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '10vh' }}>
      <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <CheckCircle2 size={64} color="var(--color-success)" style={{ margin: '0 auto 24px' }} />
        
        <h1 style={{ marginBottom: '8px' }}>Quiz Completed</h1>
        <p style={{ marginBottom: '32px', fontSize: '1.2rem' }}>{message}</p>
        
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          padding: '24px', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>
            {percentage}%
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', color: 'var(--text-secondary)' }}>
            <div>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-success)', fontWeight: 'bold' }}>{score}</div>
              <div style={{ fontSize: '0.8rem' }}>Correct</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-error)', fontWeight: 'bold' }}>{total - score}</div>
              <div style={{ fontSize: '0.8rem' }}>Incorrect</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{total}</div>
              <div style={{ fontSize: '0.8rem' }}>Total</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn-primary" onClick={restartQuiz} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RotateCcw size={18} /> Retry Same Questions
          </button>
          <button className="btn-secondary" onClick={resetSetup} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Settings size={18} /> Configure New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
