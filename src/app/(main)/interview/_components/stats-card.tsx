'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Brain, Target, Trophy } from 'lucide-react';
import { title } from 'process';

const StatsCards = ({ assessments }: { assessments: Assessment[] }) => {
  const getAverageScore = (assessments: Assessment[]) => {
    if (!assessments.length) return 0;
    const total = assessments.reduce((acc, cur) => acc + cur.quizScore, 0);
    return (total / assessments.length).toFixed(1);
  };

  const getTotalQuestions = (assessments: Assessment[]) => {
    if (!assessments.length) return 0;
    return assessments.reduce((acc, cur) => acc + cur.questions.length, 0);
  };
  const getLatestScore = (assessments: Assessment[]) => {
    if (!assessments.length) return 0;
    return assessments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0].quizScore;
  };
  const statsCardsData = [
    {
      title: 'Average Score',
      description: 'Across all assessments',
      data: getAverageScore(assessments) + '%',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      title: 'Question Practiced',
      description: 'Total questions',
      data: getTotalQuestions(assessments),
      icon: <Brain className="w-4 h-4" />,
    },
    {
      title: 'Latest Score',
      description: 'Most recent quiz',
      data: getLatestScore(assessments) + '%',
      icon: <Target className="w-4 h-4" />,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsCardsData.map(({ title, description, data, icon }, index) => (
        <Card key={index}>
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle>{title}</CardTitle>
              {icon}
            </div>
            <CardTitle className="text-2xl space-y-2 font-bold">
              {data}
              <p className="text-sm font-medium text-muted-foreground">
                {description}
              </p>
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
