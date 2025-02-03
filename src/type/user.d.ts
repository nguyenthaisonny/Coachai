import { IndustryInsight } from '@prisma/client';

type User = {
  id: string; // UUID
  clerkUserId: string; // Clerk user ID
  email: string;
  name?: string;
  imageUrl?: string;
  industry: string; // Combined industry-subindustry (e.g., "tech-software-development")
  createdAt: Date;
  updatedAt: Date;

  // Profile fields
  bio?: string;
  experience?: number; // Years of experience

  // Relations
  skills: string[]; // Array of skills
  assessments: Assessment[];
  resume?: Resume;
  coverLetter: CoverLetter[];
  industryInsight?: IndustryInsight;
};

type UserOnBoarding = Pick<User, 'industry' | 'experience' | 'skills' | 'bio'>;
