'use server';
import { db } from '@/lib/prisma';
import { checkUserLogin } from './user';
import { CoverLetter } from '@prisma/client';
import geminiModel from '@/AIs/gemini/gemini-model';
import { useUser } from '@clerk/nextjs';

export async function getCoverLetters(): Promise<CoverLetter[] | null> {
  const { user } = await checkUserLogin();
  try {
    const coverLetter = db.coverLetter.findMany({
      where: { userId: user.id },
    });
    if (!coverLetter) return null;
    return coverLetter;
  } catch (error: any) {
    console.error(error.message);
    throw new Error('Failed to fetch cover letter');
  }
}

export async function getCoverLetter(id: string): Promise<CoverLetter | null> {
  const { user } = await checkUserLogin();
  try {
    const coverLetter = db.coverLetter.findUnique({
      where: { id: id },
    });
    if (!coverLetter) return null;
    return coverLetter;
  } catch (error: any) {
    console.error(error.message);
    throw new Error('Failed to fetch cover letter');
  }
}

export async function saveCoverLetter(coverLetter: CoverLetter) {
  const { user } = await checkUserLogin();
  try {
    const newCoverLetter = db.coverLetter.create({
      data: {
        ...coverLetter,
        userId: user.id as string,
      },
    });
    if (!coverLetter) return null;
    return newCoverLetter;
  } catch (error: any) {
    console.error(error.message);
    throw new Error('Failed to create cover letter');
  }
}

export async function updateCoverLetter(coverLetter: CoverLetter) {
  try {
    const newCoverLetter = db.coverLetter.update({
      where: { id: coverLetter.id },
      data: {
        ...coverLetter,
      },
    });
    if (!coverLetter) return null;
    return newCoverLetter;
  } catch (error: any) {
    console.error(error.message);
    throw new Error('Failed to create cover letter');
  }
}

export async function generateCoverLetterContentWithAI({
  companyName,
  jobTitle,
  jobDescription,
  content,
}: {
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  content?: string;
}): Promise<string> {
  const prompt = `
     Write a professional and engaging cover letter for the ${jobTitle} position at ${companyName}. Follow this structure:
     Opening Paragraph: Express enthusiasm for the role and briefly introduce relevant skills.
     Second Paragraph: Highlight past experience, mentioning key technologies, projects, or achievements that demonstrate expertise.
     Third Paragraph: Emphasize problem-solving abilities, adaptability, and teamwork. Mention a specific reason for interest in {companyName}.
     Closing Paragraph: Express eagerness to discuss qualifications further and thank the reader for their time.
     If {jobDescription} is provided, tailor the content accordingly. If {content} is provided, refine and enhance it for clarity, impact, and professionalism. Ensure a confident and enthusiastic tone.

      content: ${content ? content : 'not provided'}
      jobDescription: ${jobDescription ? jobDescription : 'not provided'}


     
    `;
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const coverLetterContnet = response.text().trim();
    return coverLetterContnet;
  } catch (error: any) {
    console.error('Error create cover letter content: ', error.message);
    throw new Error('Failed to  create cover letter content');
  }
}

export async function deleteCoverLetter(id: string) {
  try {
    await db.coverLetter.delete({ where: { id } });
  } catch (error: any) {
    console.error('Error delete cover letter: ', error.message);
    throw new Error('Failed to delete letter content');
  }
}
