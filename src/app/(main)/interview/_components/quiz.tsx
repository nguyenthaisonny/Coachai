'use client';
import { generateQuestions, saveQuizResult } from '@/actions/interview';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useFetch from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import QuizResult from './quiz-result';
import { toast } from 'sonner';

export const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const {
    loading: isGeneratingQuiz,
    fn: generateQuizFn,
    data: dataQuizResponse,
  } = useFetch<null, Question[]>(generateQuestions);
  const {
    loading: isLoadingScore,
    fn: savingQuizFn,
    data: resultData,
    setData: setResultData,
  } = useFetch<RawQuizResult, Assessment>(saveQuizResult);
  useEffect(() => {
    if (dataQuizResponse) {
      setAnswers(new Array(dataQuizResponse?.length).fill(null));
    }
  }, [dataQuizResponse]);

  const handleGenerateQuiz = () => {
    generateQuizFn(null);
  };
  const handleAnswer = (answer: string) => {
    const newAnswer = [...answers];
    newAnswer[currentQuestionIndex] = answer;
    setAnswers(newAnswer);
  };
  const handleNext = () => {
    if (dataQuizResponse) {
      if (currentQuestionIndex < dataQuizResponse.length - 1) {
        setCurrentQuestionIndex((state) => state + 1);
        setShowExplanation(false);
        return;
      }
      scoringQuiz();
    }
  };
  const startNewQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn(null);
    setResultData(null);
    window.scrollTo({ top: 0 });
  };
  const scoringQuiz = async () => {
    if (dataQuizResponse) {
      try {
        await savingQuizFn({ questions: dataQuizResponse, answers });
        toast.success('Quiz completed!');
      } catch (error: any) {
        toast.error(error.message || 'Fail to save quiz results');
      }
    }
  };
  const questionInfo =
    dataQuizResponse && dataQuizResponse[currentQuestionIndex];
  if (isGeneratingQuiz) {
    return <BarLoader className="mt-4" width={'100%'} color="gray" />;
  }
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }
  if (!dataQuizResponse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ready to test your knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleGenerateQuiz}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {currentQuestionIndex + 1} of {dataQuizResponse?.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{questionInfo?.question}</p>
        <RadioGroup
          className="space-y-2"
          onValueChange={handleAnswer}
          value={answers[currentQuestionIndex]}
        >
          {questionInfo?.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explaination: </p>
            <p className="text-muted-foreground">{questionInfo?.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => setShowExplanation(true)}
          variant="outline"
          disabled={!answers[currentQuestionIndex]}
        >
          Show Explaination
        </Button>

        <Button
          onClick={handleNext}
          className="ml-auto"
          disabled={!answers[currentQuestionIndex] || isLoadingScore}
        >
          {isLoadingScore && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {currentQuestionIndex < dataQuizResponse.length - 1
            ? 'Next question'
            : 'Score'}
        </Button>
      </CardFooter>
    </Card>
  );
};
