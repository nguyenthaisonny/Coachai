import { z } from 'zod';

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
});
