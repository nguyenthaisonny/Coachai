'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const PerformanceChart = ({ assessments }: { assessments: Assessment[] }) => {
  const [dataChart, setDataChart] = useState<Assessment[]>(
    Array.from({ length: 12 }),
  );
  useEffect(() => {
    if (assessments.length) {
      const dataTrend = assessments.map(({ quizScore, createdAt }, index) => ({
        date: format(new Date(), 'MMM, yyyy'),
        quizScore: quizScore,
      }));
      setDataChart(dataTrend);
    }
  }, [assessments]);
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-4xl font-bold gradient-title">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz score over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={dataChart}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-md">
                      <p className="font-medium">{label}</p>
                      {payload.map((item, index) => (
                        <p key={index} className="text-sm">
                          Quiz Score: {item.value}%
                        </p>
                      ))}
                    </div>
                  );
                }
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="quizScore"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Quiz Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
