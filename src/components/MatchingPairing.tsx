import React, { useState, useEffect, useRef } from 'react';
import type { MatchingPairQuestion } from '../types';
import { Check, X } from 'lucide-react';

interface MatchingPairingProps {
  question: MatchingPairQuestion;
  onSubmit: (answers: any, isCorrect: boolean) => void;
  onNext: () => void;
}

export const MatchingPairing: React.FC<MatchingPairingProps> = ({ question, onSubmit, onNext }) => {
  const { pairs, distractors } = question.details;
  
  const [leftItems, setLeftItems] = useState<{ id: string, text: string, type: 'left' }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string, text: string, type: 'right' }[]>([]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  
  // connection maps leftId -> rightId
  const [connections, setConnections] = useState<Record<string, string>>({});
  
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ x1: number, y1: number, x2: number, y2: number, color: string, leftId: string, rightId: string }[]>([]);

  const colors = ['#FF5A5F', '#FFB547', '#35C759', '#4F8CFF', '#9D4EDD', '#FF006E', '#00B4D8'];

  useEffect(() => {
    const left = [
      ...pairs.map((p, i) => ({ id: `L${i}`, text: p.left, type: 'left' as const })),
      ...(distractors || []).map((d, i) => ({ id: `D${i}`, text: d, type: 'left' as const }))
    ];
    const right = pairs.map((p, i) => ({ id: `R${i}`, text: p.correctRight, type: 'right' as const }));

    setLeftItems(left.sort(() => 0.5 - Math.random()));
    setRightItems(right.sort(() => 0.5 - Math.random()));
    
    setConnections({});
    setSelectedId(null);
    setSelectedSide(null);
    setSubmitted(false);
  }, [question]);

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [connections, leftItems, rightItems, submitted]);

  const updateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const newLines = Object.entries(connections).map(([leftId, rightId], index) => {
      const leftEl = document.getElementById(`conn-${leftId}`);
      const rightEl = document.getElementById(`conn-${rightId}`);
      
      if (!leftEl || !rightEl) return null;
      
      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();
      
      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
      
      const color = colors[index % colors.length];

      return { x1, y1, x2, y2, color, leftId, rightId };
    }).filter(Boolean) as any[];

    setLines(newLines);
  };

  const handleClick = (id: string, side: 'left' | 'right') => {
    if (submitted) return;

    if (side === 'left' && connections[id]) {
      const newConns = { ...connections };
      delete newConns[id];
      setConnections(newConns);
      setSelectedId(null);
      setSelectedSide(null);
      return;
    }
    
    if (side === 'right') {
      const leftKey = Object.keys(connections).find(k => connections[k] === id);
      if (leftKey) {
        const newConns = { ...connections };
        delete newConns[leftKey];
        setConnections(newConns);
        setSelectedId(null);
        setSelectedSide(null);
        return;
      }
    }

    if (!selectedId) {
      setSelectedId(id);
      setSelectedSide(side);
    } else {
      if (selectedSide === side) {
        setSelectedId(id === selectedId ? null : id);
        setSelectedSide(id === selectedId ? null : side);
      } else {
        const newConns = { ...connections };
        if (selectedSide === 'left') {
          newConns[selectedId] = id;
        } else {
          newConns[id] = selectedId;
        }
        
        if (selectedSide === 'left') {
          const existingLeft = Object.keys(newConns).find(k => k !== selectedId && newConns[k] === id);
          if (existingLeft) delete newConns[existingLeft];
        } else {
          const existingLeft = Object.keys(newConns).find(k => k !== id && newConns[k] === selectedId);
          if (existingLeft) delete newConns[existingLeft];
        }

        setConnections(newConns);
        setSelectedId(null);
        setSelectedSide(null);
      }
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    let allCorrect = true;
    
    leftItems.forEach(item => {
      const rightId = connections[item.id];
      if (item.id.startsWith('D')) {
        if (rightId) allCorrect = false;
      } else {
        if (!rightId) {
          allCorrect = false;
        } else {
          const leftIndex = parseInt(item.id.substring(1));
          const rightIndex = parseInt(rightId.substring(1));
          if (pairs[leftIndex].correctRight !== pairs[rightIndex].correctRight) {
             allCorrect = false;
          }
        }
      }
    });

    rightItems.forEach(item => {
      const leftId = Object.keys(connections).find(k => connections[k] === item.id);
      if (!leftId) allCorrect = false;
    });

    setIsCorrect(allCorrect);
    setSubmitted(true);
    onSubmit(connections, allCorrect);
  };

  const renderItem = (item: { id: string, text: string, type: 'left' | 'right' }) => {
    const isSelected = selectedId === item.id;
    let isConnected = false;
    
    if (item.type === 'left') {
      isConnected = !!connections[item.id];
    } else {
      isConnected = Object.values(connections).includes(item.id);
    }
    
    let borderColor = isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)';

    if (submitted) {
      if (item.type === 'left') {
        if (item.id.startsWith('D')) {
           borderColor = isConnected ? 'var(--color-error)' : 'var(--color-success)';
        } else {
           const rightId = connections[item.id];
           if (!rightId) {
             borderColor = 'var(--color-error)';
           } else {
             const leftIndex = parseInt(item.id.substring(1));
             const rightIndex = parseInt(rightId.substring(1));
             const isMatch = pairs[leftIndex].correctRight === pairs[rightIndex].correctRight;
             borderColor = isMatch ? 'var(--color-success)' : 'var(--color-error)';
           }
        }
      } else {
        const leftId = Object.keys(connections).find(k => connections[k] === item.id);
        if (!leftId) {
          borderColor = 'var(--color-error)';
        } else {
          if (leftId.startsWith('D')) {
             borderColor = 'var(--color-error)';
          } else {
             const leftIndex = parseInt(leftId.substring(1));
             const rightIndex = parseInt(item.id.substring(1));
             const isMatch = pairs[leftIndex].correctRight === pairs[rightIndex].correctRight;
             borderColor = isMatch ? 'var(--color-success)' : 'var(--color-error)';
          }
        }
      }
    }

    return (
      <div 
        key={item.id}
        id={`conn-${item.id}`}
        style={{
          padding: '16px',
          backgroundColor: 'var(--bg-card)',
          border: `2px solid ${borderColor}`,
          borderRadius: 'var(--radius-sm)',
          cursor: submitted ? 'default' : 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: '60px',
          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
          transition: 'all 0.2s',
          zIndex: 2,
        }}
        onClick={() => handleClick(item.id, item.type)}
      >
        <div style={{
          position: 'absolute',
          [item.type === 'left' ? 'right' : 'left']: '-6px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: isSelected || isConnected ? 'var(--accent-primary)' : 'var(--text-secondary)',
          zIndex: 3
        }} />
        
        <span style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{item.text}</span>
      </div>
    );
  };

  return (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Tap an item on one side, then tap the matching item on the other side. Leave distractors unconnected.
      </p>

      <div 
        ref={containerRef}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          position: 'relative',
          marginBottom: '24px',
          gap: '40px'
        }}
      >
        <svg 
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, width: '100%', height: '100%', 
            pointerEvents: 'none', 
            zIndex: 1 
          }}
        >
          {lines.map((line, i) => (
            <path
              key={i}
              d={`M ${line.x1} ${line.y1} C ${line.x1 + 50} ${line.y1}, ${line.x2 - 50} ${line.y2}, ${line.x2} ${line.y2}`}
              fill="none"
              stroke={line.color}
              strokeWidth="3"
            />
          ))}
        </svg>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 2 }}>
          {leftItems.map(renderItem)}
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 2 }}>
          {rightItems.map(renderItem)}
        </div>
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
          disabled={Object.keys(connections).length === 0}
        >
          Submit
        </button>
      )}
    </div>
  );
};
