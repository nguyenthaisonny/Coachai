'use server';
import React from 'react';
import AICoverLetterResult from '../_components/ai-cover-letter-result';
import { getCoverLetter } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id[0];
  const coverLetter = await getCoverLetter(id);
  if (!coverLetter) return null;
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href={'/ai-cover-letter'}>
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to My Cover Letters
          </Button>
        </Link>
        <h1 className="text-6xl font-bold gradient-title mb-5">
          My Cover Letter
        </h1>
        <AICoverLetterResult value={coverLetter} />
      </div>
    </div>
  );
};

export default Page;
