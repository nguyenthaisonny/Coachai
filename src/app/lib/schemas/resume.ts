import { z } from 'zod';

export const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  mobile: z
    .string()
    .regex(/^\+\d{1,3}\s?\d{4,14}$/, 'Phone number must include country code')
    .optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().min(1, 'Organization is required'),
    startDate: z.string().min(1, 'Start day is required'),
    endDate: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: 'End date is required unless this is your current posotion',
      path: ['endDate'],
    },
  )
  .refine(
    (data) => {
      if (data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
        return false;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    },
  );

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, 'Professional summary is required'),
  skills: z.string().min(1, 'Skills are required'),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  project: z.array(entrySchema),
});
