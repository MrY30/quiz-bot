import React, { useState, useEffect } from 'react';
import type { MatchingGroupQuestion } from '../types';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchingGroupingProps {
  question: MatchingGroupQuestion;
  onSubmit: (answers: any, isCorrect: boolean) => void;
  onNext: () => void;
}

export const MatchingGrouping: React.FC<MatchingGroupingProps> = ({ question, onSubmit, onNext }) => {
  const { groups, items, distractors } = question.details;
  
  // State for items: id -> groupName (or null if unassigned)
  const [itemPlacements, setItemPlacements] = useState<Record<string, string | null>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // We add unique IDs to items to track them easily
  const [shuffledItems, setShuffledItems] = useState<{ id: string, text: string, originalGroup: string }[]>([]);

  useEffect(() => {
    // Initialize
    const allItems = [
      ...items.map((i, idx) => ({ id: `item-${idx}`, text: i.item, originalGroup: i.correctGroup })),
      ...(distractors || []).map((d, idx) => ({ id: `distractor-${idx}`, text: d, originalGroup: 'distractor' }))
    ];
    
    setShuffledItems(allItems.sort(() => 0.5 - Math.random()));
    
    const initialPlacements: Record<string, string | null> = {};
    allItems.forEach(item => {
      initialPlacements[item.id] = null;
    });
    setItemPlacements(initialPlacements);
    setSelectedItem(null);
    setSubmitted(false);
  }, [question]);

  const handleItemClick = (id: string) => {
    if (submitted) return;
    if (selectedItem === id) {
      setSelectedItem(null); // deselect
    } else {
      setSelectedItem(id);
    }
  };

  const handleGroupClick = (groupName: string | null) => {
    if (submitted || !selectedItem) return;
    setItemPlacements(prev => ({
      ...prev,
      [selectedItem]: groupName
    }));
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    let allCorrect = true;
    let anyPlaced = false;

    // Check correctness
    Object.entries(itemPlacements).forEach(([id, group]) => {
      if (group !== null) anyPlaced = true;
      const itemDef = shuffledItems.find(i => i.id === id);
      if (itemDef) {
        if (itemDef.originalGroup === 'distractor' && group !== null) {
          allCorrect = false;
        } else if (itemDef.originalGroup !== 'distractor' && itemDef.originalGroup !== group) {
          allCorrect = false;
        }
      }
    });

    // Also need to ensure all non-distractors are placed
    const unplacedRequired = shuffledItems.find(i => i.originalGroup !== 'distractor' && itemPlacements[i.id] === null);
    if (unplacedRequired) {
      allCorrect = false;
    }

    if (!anyPlaced) return;

    setIsCorrect(allCorrect);
    setSubmitted(true);
    onSubmit(itemPlacements, allCorrect);
  };

  const unassignedItems = shuffledItems.filter(i => itemPlacements[i.id] === null);

  const getItemStyle = (id: string) => {
    const isSelected = selectedItem === id;
    let borderColor = isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)';
    
    if (submitted) {
      const itemDef = shuffledItems.find(i => i.id === id);
      const currentGroup = itemPlacements[id];
      if (currentGroup !== null) {
        if (itemDef?.originalGroup === currentGroup) {
          borderColor = 'var(--color-success)';
        } else {
          borderColor = 'var(--color-error)';
        }
      } else {
        if (itemDef?.originalGroup !== 'distractor') {
          borderColor = 'var(--color-error)'; // Missed placing this
        }
      }
    }

    return {
      padding: '12px 16px',
      backgroundColor: 'var(--bg-card)',
      border: `2px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      marginBottom: '8px',
      cursor: submitted ? 'default' : 'pointer',
      fontSize: '0.9rem',
      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.2s',
      color: 'var(--text-primary)',
      whiteSpace: 'pre-wrap'
    };
  };

  return (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Tap an item, then tap a group to move it.
      </p>

      <div className="grouping-layout">
        
        {/* Source Items Container */}
        <div 
          className="grouping-available"
          style={{ 
            padding: '16px', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            minHeight: '100px',
            border: selectedItem ? '2px dashed var(--accent-primary)' : '2px solid transparent',
            cursor: (selectedItem && !submitted) ? 'pointer' : 'default'
          }}
          onClick={() => handleGroupClick(null)}
        >
          <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Available Items</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <AnimatePresence>
              {unassignedItems.map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={getItemStyle(item.id)}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleItemClick(item.id);
                  }}
                >
                  {item.text}
                </motion.div>
              ))}
            </AnimatePresence>
            {unassignedItems.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>All items placed</span>}
          </div>
        </div>

        {/* Groups Containers */}
        <div className="grouping-targets" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {groups.map((group, idx) => {
            const groupItems = shuffledItems.filter(i => itemPlacements[i.id] === group);
            return (
              <div 
                key={idx}
                style={{ 
                  padding: '16px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-md)',
                  minHeight: '150px',
                  border: selectedItem ? '2px dashed var(--accent-primary)' : '2px solid transparent',
                  cursor: (selectedItem && !submitted) ? 'pointer' : 'default'
                }}
                onClick={() => handleGroupClick(group)}
              >
                <h4 style={{ marginBottom: '16px', textAlign: 'center' }}>{group}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <AnimatePresence>
                    {groupItems.map(item => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={getItemStyle(item.id)}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleItemClick(item.id);
                        }}
                      >
                        {item.text}
                        {submitted && item.originalGroup === group && <Check size={14} color="var(--color-success)" style={{ float: 'right', marginTop: '2px' }} />}
                        {submitted && item.originalGroup !== group && <X size={14} color="var(--color-error)" style={{ float: 'right', marginTop: '2px' }} />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
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
          disabled={unassignedItems.length === shuffledItems.length}
        >
          Submit
        </button>
      )}
    </div>
  );
};
