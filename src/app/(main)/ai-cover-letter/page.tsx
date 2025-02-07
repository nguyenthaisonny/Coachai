import { getCoverLetters } from '@/actions/cover-letter';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AICoverLetterList from './_components/ai-cover-letter-list';

const AICoverLetterPage = async () => {
  const coverLetters = (await getCoverLetters()) || [];
  return (
    <div>
      <div>
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-6xl font-bold gradient-title mb-5">
              My Cover Letters
            </h1>
            <Link href={`ai-cover-letter/create`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            <AICoverLetterList coverLetters={coverLetters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoverLetterPage;
