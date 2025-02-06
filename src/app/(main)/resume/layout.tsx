'use client';
import React, { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
const ResumeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-5">
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

export default ResumeLayout;
