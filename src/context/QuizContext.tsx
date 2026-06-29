import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Question, QuizConfig } from '../types';

interface QuizState {
  config: QuizConfig | null;
  questions: Question[];
  currentIndex: number;
  score: number;
  isFinished: boolean;
  userAnswers: any[];
}

interface QuizContextType extends QuizState {
  startQuiz: (config: QuizConfig, loadedQuestions: Question[]) => void;
  submitAnswer: (answer: any, isCorrect: boolean) => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  resetSetup: () => void;
}

const initialState: QuizState = {
  config: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  isFinished: false,
  userAnswers: [],
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<QuizState>(initialState);

  const startQuiz = (config: QuizConfig, loadedQuestions: Question[]) => {
    setState({
      ...initialState,
      config,
      questions: loadedQuestions,
    });
  };

  const submitAnswer = (answer: any, isCorrect: boolean) => {
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      userAnswers: [...prev.userAnswers, { answer, isCorrect }],
    }));
  };

  const nextQuestion = () => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, isFinished: true, currentIndex: nextIndex };
      }
      return { ...prev, currentIndex: nextIndex };
    });
  };

  const restartQuiz = () => {
    // Keep the same config and questions, just reset progress
    setState(prev => ({
      ...prev,
      currentIndex: 0,
      score: 0,
      isFinished: false,
      userAnswers: [],
    }));
  };

  const resetSetup = () => {
    setState(initialState);
  };

  return (
    <QuizContext.Provider value={{
      ...state,
      startQuiz,
      submitAnswer,
      nextQuestion,
      restartQuiz,
      resetSetup
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
