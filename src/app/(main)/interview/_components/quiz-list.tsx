'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import QuizResult from './quiz-result';

const QuizList = ({ assessments }: { assessments: Assessment[] }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>();
  const router = useRouter();
  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="text-4xl gradient-text font-bold">
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review your past quiz performance</CardDescription>
          </div>
          <Button onClick={() => router.push('/interview/mock')}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment, index) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <CardHeader>
                  <CardTitle>Quiz {index + 1}</CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                    <div>
                      {format(
                        new Date(assessment.createdAt),
                        'MMMM dd, yyyy HH:mm',
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {assessment.improvementTip}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Dialog */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <QuizResult
              result={selectedQuiz}
              hideStartNew
              onStartNew={() => {
                router.push('interview/mock');
              }}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
