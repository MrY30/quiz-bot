import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import type { Question } from '../types';

export const QuizSetup: React.FC = () => {
  const { startQuiz } = useQuiz();
  const [numQuestions, setNumQuestions] = useState<number>(25);
  const [startId, setStartId] = useState<number>(1);
  const [endId, setEndId] = useState<number>(438);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Load the JSON file
    fetch('/quiz_files/ccna_001_438.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.questions) {
          setAllQuestions(data.questions);
        }
      })
      .catch(err => console.error("Failed to load questions", err));
  }, []);

  const handleStart = () => {
    setError(null);
    if (startId > endId) {
      setError("Start ID cannot be greater than End ID.");
      return;
    }
    
    // Filter by range
    const filtered = allQuestions.filter(q => q.id >= startId && q.id <= endId);
    
    if (filtered.length === 0) {
      setError(`No questions found between ID ${startId} and ${endId}.`);
      return;
    }
    
    if (numQuestions > filtered.length) {
      setError(`Only ${filtered.length} questions available in this range. Please lower the number of questions.`);
      return;
    }

    setLoading(true);
    
    // Shuffle and slice
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numQuestions);
    
    setTimeout(() => {
      startQuiz({ numQuestions, startId, endId }, selected);
    }, 500); // Small delay for UX
  };

  return (
    <div className="setup-container" style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '10vh' }}>
      <div className="card">
        <h1 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '2rem' }}>CCNA Quiz</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Number of Questions</label>
          <input 
            type="number"
            value={numQuestions} 
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            min={1}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Start ID</label>
            <input 
              type="number" 
              value={startId} 
              onChange={(e) => setStartId(Number(e.target.value))}
              min={1}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>End ID</label>
            <input 
              type="number" 
              value={endId} 
              onChange={(e) => setEndId(Number(e.target.value))}
              min={1}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <button 
          className="btn-primary" 
          style={{ width: '100%' }} 
          onClick={handleStart}
          disabled={loading || allQuestions.length === 0}
        >
          {loading ? 'Preparing...' : (allQuestions.length === 0 ? 'Loading Database...' : 'Start Quiz')}
        </button>
      </div>
    </div>
  );
};
