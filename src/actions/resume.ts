'use server';
import { checkUserLogin } from '@/actions/user';
import geminiModel from '@/AIs/gemini/gemini-model';
import { db } from '@/lib/prisma';
import { Resume } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { toast } from 'sonner';

export async function saveResume(content: string): Promise<Resume> {
  const { user } = await checkUserLogin();
  try {
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      create: { userId: user.id, content },
      update: { content },
    });
    revalidatePath('/resume');
    return resume;
  } catch (error: any) {
    console.error('Error saving resume', error.message);
    throw new Error('Faild to save resume');
  }
}

export async function getResume(): Promise<Resume | null> {
  const { user } = await checkUserLogin();
  try {
    const resume = await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!resume) {
      return null;
    }
    return resume;
  } catch (error: any) {
    console.error('Error getting resume', error.message);
    throw new Error('Faild getting resume');
  }
}

export async function improveWithAI({
  current,
  type,
}: {
  current: string;
  type: string;
}): Promise<string> {
  const { user } = await checkUserLogin();
  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const improveContent = response.text().trim();
    return improveContent;
  } catch (error: any) {
    console.error('Error improving content: ', error.message);
    throw new Error('Failed to improve content');
  }
}
