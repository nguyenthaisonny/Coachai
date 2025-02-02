import React from 'react'
import {industries} from '@/data/industries'
import OnboardingForm from '@/app/(main)/onboarding/_components/onboarding.form'
import { getUserOnBoardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'
const OnBoardinngPage = async () => {
  const {isOnboarded} = await getUserOnBoardingStatus()
  if(isOnboarded) {
    redirect('/dashboard')
  }
  return (
    <main>
        <OnboardingForm
            industries={industries}
        />
    </main>
  )
}
export default OnBoardinngPage