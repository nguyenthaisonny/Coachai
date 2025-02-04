import { IndustryInsight, User } from '@prisma/client';

type User = Omit<User> & {
  assessments: Assessment[];
  resume?: Resume;
  coverLetter: CoverLetter[];
  industryInsight?: IndustryInsight;
};

type UserOnBoarding = Pick<User, 'experience' | 'skills' | 'bio'> & {
  industry: string;
};
