export type TapQuestion = {
  type: 'tap' | 'solve';
  prompt: string;
  diagram?: string;
  diagramProps?: Record<string, unknown>;
  options: string[];
  correct: number;
  selitys: string;
};

export type MatchQuestion = {
  type: 'match';
  prompt: string;
  diagram?: string;
  diagramProps?: Record<string, unknown>;
  targets: string[];
  chips: string[];
  correct: number[]; // correct[targetIdx] = chipIdx
  selitys: string;
};

export type SliderQuestion = {
  type: 'slider';
  prompt: string;
  diagram: string;
  diagramProps?: Record<string, unknown>;
  min: number;
  max: number;
  step: number;
  target: number;
  tolerance: number;
  selitys: string;
};

export type Question = TapQuestion | MatchQuestion | SliderQuestion;

export interface Level {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tint: string;
  tintSoft: string;
  shadow: string;
  questions: Question[];
}

export interface Course {
  id: string;
  title: string;
  locale: 'fi';
  levels: Level[];
}
