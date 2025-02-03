'use server';

import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { IndustryInsight } from '@prisma/client';
interface UpdateUserResponse {
  user: User;
  industryInsight: IndustryInsight;
}

export async function updateUser(
  data: UserOnBoarding,
): Promise<UpdateUserResponse> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error('User not found');
  }
  try {
    const result: any = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        if (!industryInsight) {
          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry ?? '',
              salaryRanges: [],
              growthRate: 0,
              demandLevel: 'MEDIUM',
              topSkills: [],
              marketOutlook: 'NEUTRAL',
              keyTrends: [],
              recommendedSkills: [],
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        const updateUser = await tx.user.update({
          where: {
            clerkUserId: userId,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        //find if the industry exits
        //If industry does not exist, create it with default value
        //update the user
        return {
          user: updateUser,
          industryInsight,
        };
      },
      {
        timeout: 10000, // default  5000
      },
    );

    return { success: true, ...result };
  } catch (e: any) {
    console.error('Error updating user and industry', e.message);
    throw new Error('Failed to update user profile: ', e.message);
  }
}

export async function getUserOnBoardingStatus(): Promise<{
  isOnboarded: boolean;
}> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });
    return {
      isOnboarded: !!user?.industry,
    };
  } catch (e: any) {
    console.error('Error checking onboarding status', e.message);
    throw new Error('Failed check on boarding status');
  }
}
