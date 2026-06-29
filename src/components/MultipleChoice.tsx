import React, { useState, useEffect } from 'react';
import type { MultipleChoiceQuestion } from '../types';
import { Check, X } from 'lucide-react';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  onSubmit: (answer: number[], isCorrect: boolean) => void;
  onNext: () => void;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ question, onSubmit, onNext }) => {
  const { choices, correct } = question.details;
  const isMultiple = correct.length > 1;
  
  // We need to shuffle choices but remember their original indices to check correctness
  const [shuffledChoices, setShuffledChoices] = useState<{ originalIndex: number, text: string }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    // Shuffle choices on load
    const indexedChoices = choices.map((text, originalIndex) => ({ originalIndex, text }));
    const shuffled = [...indexedChoices].sort(() => 0.5 - Math.random());
    setShuffledChoices(shuffled);
    setSelected([]);
    setSubmitted(false);
  }, [question]);

  const handleSelect = (originalIndex: number) => {
    if (submitted) return;

    if (isMultiple) {
      if (selected.includes(originalIndex)) {
        setSelected(selected.filter(i => i !== originalIndex));
      } else {
        setSelected([...selected, originalIndex]);
      }
    } else {
      setSelected([originalIndex]);
    }
  };

  const handleSubmit = () => {
    if (submitted || selected.length === 0) return;

    // Check correctness
    let correctCount = 0;
    let incorrectCount = 0;
    
    selected.forEach(idx => {
      if (correct.includes(idx)) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const correctResult = correctCount === correct.length && incorrectCount === 0;
    setIsCorrect(correctResult);
    setSubmitted(true);
    onSubmit(selected, correctResult);
  };

  const getOptionStyle = (originalIndex: number) => {
    const isSelected = selected.includes(originalIndex);
    const isCorrectOption = correct.includes(originalIndex);

    let backgroundColor = 'var(--bg-secondary)';
    let borderColor = 'transparent';
    let color = 'var(--text-primary)';

    if (submitted) {
      if (isSelected && isCorrectOption) {
        backgroundColor = 'var(--color-success-bg)';
        borderColor = 'var(--color-success)';
      } else if (isSelected && !isCorrectOption) {
        backgroundColor = 'var(--color-error-bg)';
        borderColor = 'var(--color-error)';
      } else if (!isSelected && isCorrectOption) {
        // Highlight missed correct answers
        borderColor = 'var(--color-success)';
        backgroundColor = 'transparent';
      }
    } else {
      if (isSelected) {
        backgroundColor = 'var(--bg-card)';
        borderColor = 'var(--accent-primary)';
      }
    }

    return {
      padding: '16px',
      marginBottom: '12px',
      borderRadius: 'var(--radius-sm)',
      backgroundColor,
      border: `2px solid ${borderColor}`,
      cursor: submitted ? 'default' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      transition: 'all var(--transition-fast)',
      color
    };
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        {shuffledChoices.map((choice, i) => {
          const isSelected = selected.includes(choice.originalIndex);
          const isCorrectOption = correct.includes(choice.originalIndex);
          return (
            <div 
              key={i} 
              style={getOptionStyle(choice.originalIndex)}
              onClick={() => handleSelect(choice.originalIndex)}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: isMultiple ? '4px' : '50%',
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)'}`,
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected && !submitted ? 'var(--accent-primary)' : 'transparent',
              }}>
                {isSelected && !submitted && <div style={{ width: '10px', height: '10px', backgroundColor: 'white', borderRadius: isMultiple ? '2px' : '50%' }} />}
                {submitted && isSelected && isCorrectOption && <Check size={16} color="var(--color-success)" />}
                {submitted && isSelected && !isCorrectOption && <X size={16} color="var(--color-error)" />}
                {submitted && !isSelected && isCorrectOption && <Check size={16} color="var(--color-success)" />}
              </div>
              <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{choice.text}</span>
            </div>
          );
        })}
      </div>

      {submitted && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isCorrect ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
          color: isCorrect ? 'var(--color-success)' : 'var(--color-error)',
          marginBottom: '24px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {isCorrect ? <><Check /> Correct!</> : <><X /> Incorrect</>}
        </div>
      )}

      {submitted ? (
        <button 
          className="btn-primary" 
          style={{ width: '100%' }}
          onClick={onNext}
        >
          Next Question
        </button>
      ) : (
        <button 
          className="btn-primary" 
          style={{ width: '100%' }}
          onClick={handleSubmit}
          disabled={selected.length === 0}
        >
          Submit
        </button>
      )}
    </div>
  );
};
