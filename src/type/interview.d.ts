type Quiz = {
  questions: Question;
};

type Question = {
  question: 'string';
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type RawQuizResult = {
  questions: Question[];
  answers: string[];
};

type QuestionResult = {
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

type Assessment = Omit<Assessment, 'questions'> & {
  questions: QuestionResult[];
};
