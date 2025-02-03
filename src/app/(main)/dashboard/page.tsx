import { checkUserLogin, getUserOnBoardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';

const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnBoardingStatus();
  const { userId } = await checkUserLogin();
  if (!userId) return null;

  if (!isOnboarded) {
    redirect('/onboarding');
  }
  return <div>IndustryInsightPage</div>;
};

export default IndustryInsightPage;
