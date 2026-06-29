import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { ProgressBar } from './ProgressBar';
import { ImageViewer } from './ImageViewer';
import { MultipleChoice } from './MultipleChoice';
import { MatchingGrouping } from './MatchingGrouping';
import { MatchingPairing } from './MatchingPairing';
import { motion, AnimatePresence } from 'framer-motion';

export const QuizScreen: React.FC = () => {
  const { questions, currentIndex, submitAnswer, nextQuestion } = useQuiz();
  const question = questions[currentIndex];

  const handleNext = () => {
    nextQuestion();
  };

  const handleAnswerSubmit = (answer: any, isCorrect: boolean) => {
    submitAnswer(answer, isCorrect);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
        return <MultipleChoice key={question.id} question={question} onSubmit={handleAnswerSubmit} onNext={handleNext} />;
      case 'matching_grouping':
        return <MatchingGrouping key={question.id} question={question as any} onSubmit={handleAnswerSubmit} onNext={handleNext} />;
      case 'matching_pairing':
        return <MatchingPairing key={question.id} question={question as any} onSubmit={handleAnswerSubmit} onNext={handleNext} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          <div style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginRight: '8px' }}>[ID: {question.id}]</span>
            {question.question}
          </div>

          <ImageViewer src={question.image} />

          <div style={{ marginTop: '24px' }}>
            {renderQuestion()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
