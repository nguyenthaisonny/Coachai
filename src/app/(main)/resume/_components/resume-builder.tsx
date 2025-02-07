'use client';
import { saveResume } from '@/actions/resume';
import { resumeSchema } from '@/app/lib/schemas/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/useFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import EntryForm from './entry-form';
import { entriesToMarkdown } from '@/app/lib/helper';
import MDEditor from '@uiw/react-md-editor';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [resumeMode, setResumeMode] = useState<'preview' | 'edit'>('preview');
  const [previewContent, setPreviewContent] = useState<string | undefined>();
  const [isDowloadingPDF, setIsDownloadingPDF] = useState<boolean>();
  const { user } = useUser();
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {
        email: '',
        mobile: '',
        linkedin: '',
        twitter: '',
      },
      summary: '',
      skills: '',
      experience: [],
      education: [],
      project: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab('preview');
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === 'edit') {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success('Resume saved successfully');
    }
    if (saveError) {
      toast.error(saveError.message || 'Failed to save resume');
    }
  }, [saveResult, saveError, isSaving]);
  // const handleDownloadPDF = async () => {
  //   setIsDownloadingPDF(true);
  //   try {
  //     const element = document.getElementById('resume-pdf');
  //     const opt = {
  //       margin: [15, 15],
  //       filename: 'resume.pdf',
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  //     };

  //     await html2pdf().set(opt).from(element).save();
  //   } catch (error) {
  //     console.error('PDF generation error:', error);
  //   } finally {
  //     setIsDownloadingPDF(false);
  //   }
  // };

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(' | ')}\n\n</div>`
      : '';
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, project } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, 'Work Experience'),
      entriesToMarkdown(education, 'Education'),
      entriesToMarkdown(project, 'Projects'),
    ]
      .filter(Boolean)
      .join('\n\n');
  };
  const onSubmit = async () => {
    try {
      handleSubmit(async (data) => {
        await saveResumeFn(previewContent);
      })();
    } catch (error) {
      console.error('Save error:', error);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume
        </h1>
        <div className="space-x-2">
          <Button onClick={onSubmit} disabled={isSaving} variant="destructive">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          {/* <Button disabled={isDowloadingPDF} onClick={handleDownloadPDF}>
            {isDowloadingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin"></Loader2>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button> */}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="edit">
          <form action="" className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register('contactInfo.email')}
                    type="email"
                    placeholder="your@email.com"
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register('contactInfo.mobile')}
                    type="tel"
                    placeholder="+ 1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register('contactInfo.linkedin')}
                    type="url"
                    placeholder="https://linkedin.com/in.your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>
                  <Input
                    {...register('contactInfo.twitter')}
                    type="url"
                    placeholder="https://linkedin.com/in.your-profile"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Professional Summary</h3>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Textarea
                        {...field}
                        className="h-32"
                        placeholder="Write a compelling professional summary..."
                      />
                    );
                  }}
                />
                {errors.summary && (
                  <p className="text-sm text-red-500">
                    {errors.summary.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Skills</h3>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Textarea
                        {...field}
                        className="h-32"
                        placeholder="Write a compelling professional summary..."
                      />
                    );
                  }}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">
                    {errors.skills.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="project"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Projects"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.project && (
                <p className="text-sm text-red-500">{errors.project.message}</p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            variant="link"
            type="button"
            className="mb-2"
            onClick={() =>
              setResumeMode(resumeMode === 'preview' ? 'edit' : 'preview')
            }
          >
            {resumeMode === 'preview' ? (
              <>
                <Edit className="h-4 2-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
          {resumeMode !== 'preview' && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span>
                You will lose edited markdown if you update the from data.
              </span>
            </div>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={(value) => setPreviewContent(value)}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: 'white',
                  color: 'black',
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
