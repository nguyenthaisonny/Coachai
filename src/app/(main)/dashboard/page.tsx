import { getUserOnBoardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';

const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnBoardingStatus();
  if (!isOnboarded) {
    redirect('/onboarding');
  }
  return <div>IndustryInsightPage</div>;
};

export default IndustryInsightPage;
