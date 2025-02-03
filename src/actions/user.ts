'use server';

import { db } from '@/lib/prisma';
import { User, UserOnBoarding } from '@/type/user';
import { auth } from '@clerk/nextjs/server';
import { IndustryInsight } from '@prisma/client';
import { generateAIInsights } from '@/actions/dashboard';
interface UpdateUserResponse {
  user: User;
  industryInsight: IndustryInsight;
}

export async function updateUser(
  data: UserOnBoarding,
): Promise<UpdateUserResponse> {
  const { userId } = await checkUserLogin();
  try {
    const result: any = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data?.industry,
          },
        });

        if (!industryInsight) {
          const insights = await generateAIInsights(data?.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data?.industry,
              ...insights,
              salaryRanges: insights.salaryRanges as [],
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        const updateUser = await tx.user.update({
          where: {
            clerkUserId: userId,
          },
          data: {
            industry: data?.industry,
            experience: data?.experience,
            bio: data?.bio,
            skills: data?.skills,
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
  const { userId } = await checkUserLogin();
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

export const checkUserLogin = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const user: any = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }
  return { userId };
};
