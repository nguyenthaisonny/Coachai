type Quiz = {
  questions: Question;
};

type Question = {
  question: 'string';
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type QuizResult = {
  questions: Question[];
  answers: string[];
  score: number;
};

type QuestionResult = {
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  explaination: string;
};
