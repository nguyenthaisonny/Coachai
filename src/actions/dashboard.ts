'use server';

import { checkUserLogin } from '@/actions/user';
import { db } from '@/lib/prisma';
import { IndustryInsight } from '@prisma/client';
import { Insights, SalaryRange } from '@/type/industry';
import geminiModel from '@/AIs/gemini/gemini-model';
export const generateAIInsights = async (
  industry: string,
): Promise<Insights> => {
  const prompt = `
        Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
        {
        "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
        ],
        "growthRate": number,
        "demandLevel": "HIGH" | "MEDIUM" | "LOW",
        "topSkills": ["skill1", "skill2"],
        "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
        "keyTrends": ["trend1", "trend2"],
        "recommendedSkills": ["skill1", "skill2"]
        }
        
        IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
        Include at least 5 common roles for salary ranges.
        Growth rate should be a percentage.
        Include at least 5 skills and trends.
    `;
  const result = await geminiModel.generateContent(prompt);

  const response = result.response;
  const text = response.text();

  const cleanedText = text.replace(/```(?:json)?\n?/g, '').trim();
  return JSON.parse(cleanedText);
};

export const getIndustryInsights =
  async (): Promise<IndustryInsight | void | null> => {
    const { userId } = await checkUserLogin();
    try {
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
          industryInsight: true,
        },
      });
      if (!user?.industry) return null;
      if (!user?.industryInsight) {
        const insights = await generateAIInsights(user?.industry);
        const industryInsight = await db.industryInsight.create({
          data: {
            industry: user?.industry,
            ...insights,
            salaryRanges: insights.salaryRanges as SalaryRange[],
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        return industryInsight;
      }
      return user?.industryInsight;
    } catch (error: any) {
      console.error('Fail to generate insights: ', error.message);
    }
  };
