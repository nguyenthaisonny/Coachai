'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CoverLetter } from '@prisma/client';
import { Eye, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useFetch from '@/hooks/useFetch';
import { deleteCoverLetter } from '@/actions/cover-letter';
import { string } from 'zod';

const AICoverLetterList = ({
  coverLetters,
}: {
  coverLetters: CoverLetter[];
}) => {
  const [deleteId, setDeleteId] = useState<string>();
  const router = useRouter();
  const { loading: deleteLoading, fn: deleteCoverLetterFn } = useFetch<
    string,
    null
  >(deleteCoverLetter);
  const handleDeleteCoverLetter = async (
    event: React.MouseEvent,
    coverLetterId: string,
  ) => {
    event.stopPropagation(); // Prevents the card click event
    setDeleteId(coverLetterId);
    await deleteCoverLetterFn(coverLetterId);
    router.refresh();
  };
  return (
    <>
      {coverLetters ? (
        coverLetters.map((coverLetter: CoverLetter, index: number) => (
          <div key={index}>
            <Card
              onClick={() => router.push(`/ai-cover-letter/${coverLetter.id}`)}
              className="cursor-pointer hover:bg-muted/50 transition-colors "
            >
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {coverLetter.jobTitle} at @{coverLetter.companyName}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Created at {format(new Date(coverLetter.createdAt), 'PPP')}
                  </CardDescription>
                </div>

                <div style={{ marginTop: 0 }}>
                  <Button
                    disabled={deleteLoading && deleteId === coverLetter.id}
                    onClick={(e) => handleDeleteCoverLetter(e, coverLetter.id)}
                    variant="outline"
                  >
                    {deleteLoading && deleteId === coverLetter.id ? (
                      <div className="flex">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting...
                      </div>
                    ) : (
                      <>
                        {' '}
                        <Trash2 className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardFooter>
                <CardDescription className="text-sm">
                  {coverLetter?.jobDescription &&
                  coverLetter?.jobDescription.length < 70
                    ? coverLetter?.jobDescription
                    : coverLetter?.jobDescription?.slice(0, 70) + ' ...'}
                </CardDescription>
              </CardFooter>
            </Card>
          </div>
        ))
      ) : (
        <>No data</>
      )}
    </>
  );
};

export default AICoverLetterList;
