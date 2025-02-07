'use client';
import { coverLetterSchema } from '@/app/lib/schemas/cover-letter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Eye,
  Loader2,
  NotebookTabs,
  Save,
  Sparkles,
} from 'lucide-react';
import { register } from 'module';
import Link from 'next/link';
import { Input } from '@/components/ui/input'; // Adjust the import path according to your project structure
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  generateCoverLetterContentWithAI,
  saveCoverLetter,
} from '@/actions/cover-letter';
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/nextjs';
import { CoverLetter } from '@prisma/client';
import MDEditor from '@uiw/react-md-editor';
import AICoverLetterResult from './ai-cover-letter-result';

const AICoverLetterForm = () => {
  const [isWatchingPreview, setIsWatchingPreview] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<CoverLetter>();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      content: '',
    },
  });
  const {
    data: coverLetterContent,
    loading: isGeneratingContent,
    error: errorGenerating,
    fn: generateCoverLetterContentWithAIFn,
  } = useFetch<CoverLetterForm, string>(generateCoverLetterContentWithAI);
  const {
    data: savedCoverLetter,
    loading: isSaving,
    error: errorSaving,
    fn: saveCoverLetterFn,
  } = useFetch<CoverLetter, CoverLetter>(saveCoverLetter);
  const formData = watch();
  useEffect(() => {
    if (coverLetterContent && !isGeneratingContent) {
      setValue('content', coverLetterContent);
      toast.success('Content generated successfully');
    }
    if (errorGenerating) {
      toast.error(errorGenerating?.message || 'Failed to generate content');
    }
  }, [isGeneratingContent, coverLetterContent, errorGenerating]);

  useEffect(() => {
    if (savedCoverLetter && !isSaving) {
      setCoverLetter(savedCoverLetter);
      toast.success('Cover letter generated successfully');
    }
    if (errorSaving) {
      toast.error(errorSaving?.message || 'Failed to save cover letter');
    }
  }, [isSaving, errorSaving, savedCoverLetter]);
  const handleGenerateContent = async () => {
    if (!formData.companyName) {
      toast.error('Please enter your company name to generate with AI');
      return;
    }
    if (!formData.jobTitle) {
      toast.error('Please enter your job title to generate with AI');
      return;
    }
    return await generateCoverLetterContentWithAIFn(formData);
  };
  const getCoverLetterMarkDown = () => {
    const { content } = formData;
    return content
      ? `
        ${content}
        `
      : '';
  };
  const onSave = async (data: any) => {
    saveCoverLetterFn({
      ...data,
      content: getCoverLetterMarkDown(),
    });
  };
  return (
    <>
      {isWatchingPreview ? (
        <>
          <Button
            onClick={() => setIsWatchingPreview(false)}
            variant="outline"
            className="gap-2 pl-0"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            Back
          </Button>
          <AICoverLetterResult
            value={coverLetter || ({} as CoverLetter)}
            setValue={setCoverLetter}
          />
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between  items-center">
              <CardTitle className="text-2xl gradient-title">
                Job Details
              </CardTitle>
              <NotebookTabs className="w-4 h-4 mb-2" />
            </div>
            <CardDescription>
              Provide information about the position you're apply for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  type="text"
                  {...register('companyName')}
                  placeholder="Enter company name"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  type="text"
                  {...register('jobTitle')}
                  placeholder="Enter job title"
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                placeholder="Paste the job description here"
                className="h-32"
                {...register('jobDescription')}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content"> Cover Letter Content</Label>
              <Textarea
                placeholder="Paste your content here or generate with AI"
                className="h-32"
                {...register('content')}
              />
              {errors.content && (
                <p className="text-sm text-red-500">
                  {errors.content?.message}
                </p>
              )}
            </div>
            <Button onClick={handleGenerateContent} variant="outline">
              {isGeneratingContent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Cover Letter with AI
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-row justify-end space-x-2">
            {coverLetter && (
              <Button
                variant="outline"
                onClick={() => setIsWatchingPreview(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            )}
            <Button onClick={handleSubmit(onSave)}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default AICoverLetterForm;
