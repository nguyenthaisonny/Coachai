'use client';
import React, { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
const IndustryInsightPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
      </div>
      <Suspense
        fallback={
          <BarLoader
            width={'100%'}
            color="gray"
            cssOverride={{ marginTop: '16px' }}
          />
        }
      >
        {children}
      </Suspense>
    </div>
  );
};

export default IndustryInsightPageLayout;
