export type QuestionType = "multiple_choice" | "matching_grouping" | "matching_pairing";

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
  image: string | null;
}

export interface MultipleChoiceDetails {
  choices: string[];
  correct: number[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  details: MultipleChoiceDetails;
}

export interface MatchingGroupItem {
  item: string;
  correctGroup: string;
}

export interface MatchingGroupDetails {
  groups: string[];
  items: MatchingGroupItem[];
  distractors?: string[];
}

export interface MatchingGroupQuestion extends BaseQuestion {
  type: "matching_grouping";
  details: MatchingGroupDetails;
}

export interface MatchingPair {
  left: string;
  correctRight: string;
}

export interface MatchingPairDetails {
  pairs: MatchingPair[];
  distractors?: string[];
}

export interface MatchingPairQuestion extends BaseQuestion {
  type: "matching_pairing";
  details: MatchingPairDetails;
}

export type Question =
  | MultipleChoiceQuestion
  | MatchingGroupQuestion
  | MatchingPairQuestion;

export interface QuizConfig {
  numQuestions: number;
  startId: number;
  endId: number;
}
