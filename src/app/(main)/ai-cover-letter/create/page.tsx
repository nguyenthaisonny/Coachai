import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import AICoverLetterForm from '../_components/ai-cover-letter-form';
import Link from 'next/link';
const AICoverLetterPage = async () => {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href={'/ai-cover-letter'}>
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <h1 className="text-6xl font-bold gradient-title">
          Create Cover Letter
        </h1>
      </div>
      <AICoverLetterForm />
    </div>
  );
};

export default AICoverLetterPage;
