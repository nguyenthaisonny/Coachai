import { checkUserLogin, getUserOnBoardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React, { use } from 'react';
import DashBoardView from './_components/dashboard-view';
import { getIndustryInsights } from '@/actions/dashboard';
import { checkUser } from '@/lib/checkUser';

const IndustryInsightPage = async () => {
  const user = await checkUser();
  if(!user) throw new Error('Fail to check auth user')
  const { isOnboarded } = await getUserOnBoardingStatus();
  if (!isOnboarded) {
    redirect('/onboarding');
  }
  const insights = await getIndustryInsights();
  if (!insights) throw new Error('Faild to fetch insights');
  return (
    <div>
      <DashBoardView insights={insights} />
    </div>
  );
};

export default IndustryInsightPage;
