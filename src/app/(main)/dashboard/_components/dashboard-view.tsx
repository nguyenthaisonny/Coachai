'use client';
import {
  TrendingUp,
  LineChart,
  TrendingDown,
  BriefcaseIcon,
  Brain,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import React, { PureComponent } from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  ResponsiveContainer,
  Rectangle,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { IndustryInsight } from '@prisma/client';

const DashBoardView = ({ insights }: { insights: IndustryInsight }) => {
  const salaryData =
    insights?.salaryRanges?.map((range: any) => ({
      name: range.role,
      min: range.min / 1000,
      max: range.max / 1000,
      median: range.median / 1000,
    })) || [];

  const getDemandLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMarketOutlookInfo = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case 'positive':
        return { icon: TrendingUp, color: 'text-green-500' };
      case 'neutral':
        return { icon: LineChart, color: 'text-yellow-500' };
      case 'negative':
        return { icon: TrendingDown, color: 'text-red-500' };
      default:
        return { icon: LineChart, color: 'text-gray-500' };
    }
  };
  const OutLookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outLookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const demandLevelColor = getDemandLevelColor(insights.demandLevel);
  const lastUpdatedDate = format(new Date(insights.lastUpdated), 'dd//MM/yyyy');
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true },
  );
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last update: {lastUpdatedDate}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutLookIcon className={`h-4 w-4 ${outLookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <Brain className="h4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Display minimum, median, and maximum salaries (in thousand)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={salaryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                  }}
                />
                <Legend />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Key Industry Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              Current trends shaping the industry
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.keyTrends.map((trend) => (
                <div key={trend} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div className="text-sm font-medium">{trend}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recommended Skills</CardTitle>
            <p className="text-sm text-muted-foreground">
              SKills to consider developing
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap space-x-2">
              {insights.recommendedSkills.map((skill) => (
                <div key={skill}>
                  <Badge variant="outline">{skill}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoardView;
