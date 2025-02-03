import { IndustryInsight } from '@prisma/client';

type Insights = Omit<IndustryInsight, 'industry' | 'salaryRanges'> & {
  salaryRanges: SalaryRange[];
};
type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
};
